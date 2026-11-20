// Vercel Serverless Function for Audio Stream Resolution
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).send('Missing video id');
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

      const response = await fetch(`${instance}/streams/${id}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      const data = await response.json();

      if (data && Array.isArray(data.audioStreams) && data.audioStreams.length > 0) {
        const m4a = data.audioStreams.find(s => s.mimeType?.includes('audio/mp4') || s.format === 'M4A');
        const selected = m4a || data.audioStreams[0];

        // 302 Redirect to direct audio stream URL for Safari iOS
        res.setHeader('Location', selected.url);
        return res.status(302).end();
      }
    } catch {
      continue;
    }
  }

  return res.status(502).send('Audio stream temporarily unavailable');
}
