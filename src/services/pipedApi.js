import { searchYouTubeOfficial } from './youtubeAuth';

export const INITIAL_TRACKS = [
  {
    id: '34Na4j8AVgA',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    cover: 'https://i.ytimg.com/vi/34Na4j8AVgA/hq720.jpg',
    audioUrl: '/api/stream?id=34Na4j8AVgA',
    duration: 230,
    isStream: true
  },
  {
    id: '4NRXx6U8ABQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    cover: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hq720.jpg',
    audioUrl: '/api/stream?id=4NRXx6U8ABQ',
    duration: 200,
    isStream: true
  },
  {
    id: 'dX3k_QDnzHE',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    cover: 'https://i.ytimg.com/vi/dX3k_QDnzHE/hq720.jpg',
    audioUrl: '/api/stream?id=dX3k_QDnzHE',
    duration: 243,
    isStream: true
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio',
    artist: 'Lofi Girl',
    album: 'Beats to Relax/Study to',
    cover: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg',
    audioUrl: '/api/stream?id=jfKfPfyJRdk',
    duration: 180,
    isStream: true
  }
];

// Search songs using Google official API first, then local backend, then fallback
export async function searchSongs(query, googleToken = null) {
  if (!query || !query.trim()) return [];

  // 1. If user has Google Token, search official YouTube Data API (fastest, most accurate)
  if (googleToken) {
    try {
      const results = await searchYouTubeOfficial(query, googleToken);
      if (results && results.length > 0) {
        return results;
      }
    } catch (err) {
      console.warn('Official YouTube search error:', err);
    }
  }

  // 2. Try server search endpoint (/api/search)
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Server search failed:', err);
  }

  // 3. Fallback filter from local tracks
  return INITIAL_TRACKS.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.artist.toLowerCase().includes(query.toLowerCase())
  );
}

// Fetch stream URL for a given YouTube video ID
export async function getAudioStreamUrl(videoId) {
  return `/api/stream?id=${videoId}`;
}
