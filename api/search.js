// Vercel Serverless Function for Searching YouTube & YouTube Music via Innertube API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, type } = req.query;

  // Determine query based on requested YouTube Music section
  let searchQuery = q;
  if (!searchQuery) {
    if (type === 'beranda' || type === 'home') {
      searchQuery = 'top songs indonesia 2025 viral';
    } else if (type === 'new' || type === 'trending') {
      searchQuery = 'lagu terbaru 2025 new release';
    } else if (type === 'charts') {
      searchQuery = 'top 50 indonesia viral spotify youtube';
    } else if (type === 'albums') {
      searchQuery = 'best album compilation songs';
    } else {
      return res.status(400).json({ error: 'Missing query parameter q or valid type' });
    }
  }

  try {
    const ytRes = await fetch('https://www.youtube.com/youtubei/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20231204.01.00',
            hl: 'id',
            gl: 'ID'
          }
        },
        query: searchQuery
      })
    });

    if (!ytRes.ok) {
      throw new Error(`YouTube Innertube responded with ${ytRes.status}`);
    }

    const data = await ytRes.json();
    const sections = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    const items = [];

    for (const section of sections) {
      const contents = section?.itemSectionRenderer?.contents || [];
      for (const item of contents) {
        const v = item.videoRenderer;
        if (v && v.videoId) {
          const thumbs = v.thumbnail?.thumbnails || [];
          const bestThumb = thumbs[thumbs.length - 1]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
          
          items.push({
            id: v.videoId,
            title: v.title?.runs?.[0]?.text || 'Unknown Title',
            artist: v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || 'YouTube Artist',
            album: type ? `YouTube ${type.toUpperCase()}` : 'YouTube Music',
            cover: bestThumb,
            duration: v.lengthText?.simpleText || '',
            audioUrl: `/api/stream?id=${v.videoId}`,
            isStream: true
          });
        }
      }
    }

    if (items.length > 0) {
      return res.status(200).json(items);
    }
  } catch (err) {
    console.error('Innertube search error:', err);
  }

  // Fallback: Invidious Public Mirrors
  const INVIDIOUS_INSTANCES = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://yt.artemislena.eu'
  ];

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      const results = await response.json();

      if (Array.isArray(results) && results.length > 0) {
        const formatted = results
          .filter(item => item.videoId)
          .map(item => ({
            id: item.videoId,
            title: item.title,
            artist: item.author || 'YouTube Artist',
            album: 'YouTube Music',
            cover: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
            duration: item.lengthSeconds ? `${Math.floor(item.lengthSeconds / 60)}:${item.lengthSeconds % 60}` : '',
            audioUrl: `/api/stream?id=${item.videoId}`,
            isStream: true
          }));

        return res.status(200).json(formatted);
      }
    } catch {
      continue;
    }
  }

  return res.status(500).json({ error: 'Search failed' });
}
