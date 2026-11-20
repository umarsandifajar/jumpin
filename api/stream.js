// Vercel Serverless Function for Audio Stream Resolution
import { Ytdl } from '@distube/ytdl-core';

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

  // 1. Try resolving via @distube/ytdl-core (Official YouTube player deciphering)
  try {
    const ytdl = new Ytdl();
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const audioFormats = info.formats.filter(f => f.hasAudio && !f.hasVideo);

    // Prefer mp4 / m4a container for iOS Safari compliance
    const m4a = audioFormats.find(f => f.container === 'mp4' || f.mimeType?.includes('audio/mp4'));
    const selected = m4a || audioFormats[0];

    if (selected && selected.url) {
      res.setHeader('Location', selected.url);
      return res.status(302).end();
    }
  } catch (err) {
    console.warn('ytdl-core error:', err.message);
  }

  // 2. Fallback: Public Invidious audio proxies
  const INVIDIOUS_INSTANCES = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://yt.artemislena.eu'
  ];

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${instance}/api/v1/videos/${id}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      const data = await response.json();

      const adaptive = data.adaptiveFormats || [];
      const audioStreams = adaptive.filter(f => f.type?.startsWith('audio/') || f.container === 'm4a');
      const m4a = audioStreams.find(s => s.container === 'm4a' || s.type?.includes('audio/mp4'));
      const selected = m4a || audioStreams[0];

      if (selected && selected.url) {
        res.setHeader('Location', selected.url);
        return res.status(302).end();
      }
    } catch {
      continue;
    }
  }

  return res.status(502).send('Audio stream temporarily unavailable');
}
