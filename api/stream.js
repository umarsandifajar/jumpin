// Vercel Serverless Function for Audio Stream Proxying (Supports iOS Background Audio)
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

  // 1. Resolve via @distube/ytdl-core and proxy directly (Server-to-Server)
  try {
    const ytdl = new Ytdl();
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const audioFormats = info.formats.filter(f => f.hasAudio && !f.hasVideo);

    const m4a = audioFormats.find(f => f.container === 'mp4' || f.mimeType?.includes('audio/mp4')) || audioFormats[0];

    if (m4a && m4a.url) {
      const range = req.headers.range;
      const fetchHeaders = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
      };
      if (range) fetchHeaders['Range'] = range;

      const streamRes = await fetch(m4a.url, { headers: fetchHeaders });
      
      const responseHeaders = {
        'Content-Type': streamRes.headers.get('content-type') || 'audio/mp4',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      };

      const contentLength = streamRes.headers.get('content-length');
      if (contentLength) responseHeaders['Content-Length'] = contentLength;

      const contentRange = streamRes.headers.get('content-range');
      if (contentRange) responseHeaders['Content-Range'] = contentRange;

      res.writeHead(streamRes.status, responseHeaders);

      const bodyStream = streamRes.body;
      if (bodyStream) {
        const reader = bodyStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        return res.end();
      }
    }
  } catch (err) {
    console.warn('ytdl-core proxy error:', err.message);
  }

  return res.status(502).send('Audio stream temporarily unavailable');
}
