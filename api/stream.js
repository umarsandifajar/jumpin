// Vercel Serverless Function for Audio Stream Proxying (High-Performance iOS Background Audio)
import { Ytdl } from '@distube/ytdl-core';

// In-memory cache for audio format URLs to make Byte-Range requests instantaneous (<50ms)
const formatCache = new Map();
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).send('Missing video id');
  }

  try {
    let cached = formatCache.get(id);
    const now = Date.now();

    if (!cached || now - cached.timestamp > CACHE_TTL) {
      const ytdl = new Ytdl({ clients: ['tv', 'web_embedded'] });
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
      const audioFormats = info.formats.filter(f => f.hasAudio && !f.hasVideo);

      // Prefer itag 140 (AAC 128kbps, universally native to iOS Safari CoreAudio)
      const targetFormat = audioFormats.find(f => f.itag === 140) ||
        audioFormats.find(f => f.container === 'mp4' || f.mimeType?.includes('audio/mp4')) ||
        audioFormats[0];

      if (!targetFormat || !targetFormat.url) {
        throw new Error('No valid audio stream format found');
      }

      cached = {
        url: targetFormat.url,
        mimeType: targetFormat.mimeType?.split(';')[0] || 'audio/mp4',
        contentLength: targetFormat.contentLength || null,
        timestamp: now
      };
      formatCache.set(id, cached);
    }

    const range = req.headers.range;
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    };
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const streamRes = await fetch(cached.url, { headers: fetchHeaders });

    const responseHeaders = {
      'Content-Type': cached.mimeType,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
      'Cache-Control': 'public, max-age=3600'
    };

    const contentRange = streamRes.headers.get('content-range');
    if (contentRange) responseHeaders['Content-Range'] = contentRange;

    const contentLength = streamRes.headers.get('content-length') || cached.contentLength;
    if (contentLength) responseHeaders['Content-Length'] = contentLength;

    // Send HTTP 206 if partial content requested (critical for iOS Safari)
    const status = streamRes.status === 206 || range ? 206 : (streamRes.status || 200);
    res.writeHead(status, responseHeaders);

    if (req.method === 'HEAD') {
      return res.end();
    }

    const bodyStream = streamRes.body;
    if (bodyStream) {
      const reader = bodyStream.getReader();

      req.on('close', () => {
        try { reader.cancel(); } catch {}
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.writableEnded) {
          res.write(value);
        }
      }
      return res.end();
    }
  } catch (err) {
    console.warn(`[Stream Error ${id}]:`, err.message);
    formatCache.delete(id);
    return res.status(502).json({ error: 'Audio stream temporarily unavailable', details: err.message });
  }
}
