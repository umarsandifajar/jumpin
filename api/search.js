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
      searchQuery = 'top hits indonesia viral official music video';
    } else if (type === 'new') {
      searchQuery = 'bernadya sal priadi billie eilish espresso official music video';
    } else if (type === 'trending') {
      searchQuery = 'denny caknan sigar bernadya satu bulan official music video';
    } else if (type === 'charts') {
      searchQuery = 'top 50 indonesia viral spotify official audio';
    } else if (type === 'albums') {
      searchQuery = 'best album songs indonesia';
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

    if (ytRes.ok) {
      const data = await ytRes.json();
      const sections = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
      const items = [];

      for (const section of sections) {
        const contents = section?.itemSectionRenderer?.contents || [];
        for (const item of contents) {
          const v = item.videoRenderer;
          if (v && v.videoId) {
            const rawTitle = v.title?.runs?.[0]?.text || 'Unknown Title';
            const lowerTitle = rawTitle.toLowerCase();

            // Filter out 1-hour/full-album compilation mixes to keep track list authentic
            if (lowerTitle.includes('full album') || lowerTitle.includes('kompilasi') || lowerTitle.includes('1 jam') || lowerTitle.includes('non stop')) {
              continue;
            }

            const thumbs = v.thumbnail?.thumbnails || [];
            const bestThumb = thumbs[thumbs.length - 1]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
            
            items.push({
              id: v.videoId,
              title: rawTitle,
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
    }
  } catch (err) {
    console.error('Innertube search error:', err);
  }

  return res.status(200).json([]);
}
