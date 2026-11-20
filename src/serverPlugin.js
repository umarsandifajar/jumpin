import { spawn } from 'node:child_process';
import url from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const CACHE_DIR = '/tmp/jumpin_cache';
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const activeDownloads = new Map();

function serveAudioFile(filePath, req, res) {
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end();
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mp4',
        'Access-Control-Allow-Origin': '*'
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mp4',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('serveAudioFile error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('File read error');
    }
  }
}

export function youtubeAudioPlugin() {
  return {
    name: 'youtube-audio-stream-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = url.parse(req.url, true);

        // 1. Search YouTube endpoint: /api/search?q=... or ?type=...
        if (parsedUrl.pathname === '/api/search') {
          let query = parsedUrl.query.q;
          const type = parsedUrl.query.type;

          if (!query) {
            if (type === 'beranda' || type === 'home') {
              query = 'top songs indonesia 2025 viral';
            } else if (type === 'new' || type === 'trending') {
              query = 'lagu terbaru 2025 new release';
            } else if (type === 'charts') {
              query = 'top 50 indonesia viral spotify youtube';
            } else if (type === 'albums') {
              query = 'best album compilation songs';
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Missing query parameter q or valid type' }));
            }
          }

          // Try YouTube Innertube search first (instant 100ms)
          try {
            const ytRes = await fetch('https://www.youtube.com/youtubei/v1/search', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
              },
              body: JSON.stringify({
                context: {
                  client: { clientName: 'WEB', clientVersion: '2.20231204.01.00', hl: 'id', gl: 'ID' }
                },
                query: query
              })
            });

            if (ytRes.ok) {
              const data = await ytRes.json();
              const sections = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
              const items = [];

              for (const s of sections) {
                for (const item of (s?.itemSectionRenderer?.contents || [])) {
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
                res.writeHead(200, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                return res.end(JSON.stringify(items));
              }
            }
          } catch (innerErr) {
            console.warn('Innertube local search error, falling back to yt-dlp:', innerErr);
          }

          try {
            const ytSearch = spawn('python3', [
              '-m', 'yt_dlp',
              `ytsearch10:${query}`,
              '--flat-playlist',
              '--dump-single-json',
              '--no-warnings',
              '--no-check-certificates'
            ]);

            let stdoutData = '';
            let stderrData = '';

            ytSearch.stdout.on('data', (chunk) => {
              stdoutData += chunk;
            });

            ytSearch.stderr.on('data', (chunk) => {
              stderrData += chunk;
            });

            ytSearch.on('close', (code) => {
              if (code !== 0 || !stdoutData.trim()) {
                console.warn('yt-dlp search error:', stderrData);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Search failed' }));
              }

              try {
                const parsed = JSON.parse(stdoutData);
                const entries = parsed.entries || [];
                const formatted = entries.map((entry) => {
                  const thumbnails = entry.thumbnails || [];
                  const bestThumb = thumbnails.length > 0 
                    ? thumbnails[thumbnails.length - 1].url 
                    : `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`;

                  return {
                    id: entry.id,
                    title: entry.title || 'Unknown Title',
                    artist: entry.channel || entry.uploader || 'YouTube Artist',
                    album: 'YouTube Music',
                    cover: bestThumb,
                    duration: entry.duration || 0,
                    audioUrl: `/api/stream?id=${entry.id}`,
                    isStream: true
                  };
                });

                res.writeHead(200, { 
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                return res.end(JSON.stringify(formatted));
              } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to parse search results' }));
              }
            });
          } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // 2. Stream Audio endpoint: /api/stream?id=... (with HTTP 206 Byte-Range for iOS Safari)
        if (parsedUrl.pathname === '/api/stream') {
          const videoId = parsedUrl.query.id;
          if (!videoId) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Missing video id');
          }

          const filePath = path.join(CACHE_DIR, `${videoId}.m4a`);

          // If cached file exists and valid, serve immediately with Range headers
          if (fs.existsSync(filePath) && fs.statSync(filePath).size > 50000) {
            return serveAudioFile(filePath, req, res);
          }

          // If already downloading in background, wait for it
          if (activeDownloads.has(videoId)) {
            try {
              await activeDownloads.get(videoId);
              return serveAudioFile(filePath, req, res);
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              return res.end('Download failed: ' + err.message);
            }
          }

          // Start downloading via yt-dlp to cache
          console.log(`[Stream Cache] Downloading stream for Safari: ${videoId}`);
          const downloadPromise = new Promise((resolve, reject) => {
            const proc = spawn('python3', [
              '-m', 'yt_dlp',
              '-f', 'ba[ext=m4a]/ba/b',
              '--no-warnings',
              '--no-check-certificates',
              '-o', filePath,
              `https://www.youtube.com/watch?v=${videoId}`
            ]);

            proc.on('close', (code) => {
              activeDownloads.delete(videoId);
              if (code === 0 && fs.existsSync(filePath)) {
                resolve();
              } else {
                reject(new Error(`yt-dlp download failed with code ${code}`));
              }
            });

            proc.on('error', (err) => {
              activeDownloads.delete(videoId);
              reject(err);
            });
          });

          activeDownloads.set(videoId, downloadPromise);

          try {
            await downloadPromise;
            return serveAudioFile(filePath, req, res);
          } catch (err) {
            console.error(`Stream download failed: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Stream download failed');
          }
        }

        next();
      });
    }
  };
}
