// Vercel Serverless Function for Searching YouTube Tracks
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing search query q' });
  }

  const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://api.piped.privacydev.net',
    'https://piped-api.lunar.icu'
  ];

  for (const instance of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(`${instance}/search?q=${encodeURIComponent(q)}&filter=music_songs`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      const data = await response.json();

      if (data && Array.isArray(data.items)) {
        const formatted = data.items
          .filter(item => item.type === 'stream')
          .map(item => ({
            id: item.url.replace('/watch?v=', ''),
            title: item.title,
            artist: item.uploaderName || 'YouTube Artist',
            album: 'YouTube Music',
            cover: item.thumbnail || `https://i.ytimg.com/vi/${item.url.replace('/watch?v=', '')}/hqdefault.jpg`,
            duration: item.duration || 0,
            audioUrl: `/api/stream?id=${item.url.replace('/watch?v=', '')}`,
            isStream: true
          }));

        return res.status(200).json(formatted);
      }
    } catch {
      continue;
    }
  }

  return res.status(500).json({ error: 'Search failed across all providers' });
}
