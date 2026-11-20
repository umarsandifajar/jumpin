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

export const CURATED_YOUTUBE_PLAYLISTS = [
  {
    id: 'curated_indo_hits',
    name: 'Top Hits Indonesia 2025',
    itemCount: 25,
    query: 'top songs indonesia 2025 viral',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_chill_vibes',
    name: 'Chill & Relax Vibes',
    itemCount: 20,
    query: 'chill acoustic songs cafe vibes',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_global_hits',
    name: 'Today\'s Top Global Hits',
    itemCount: 30,
    query: 'todays top hits pop 2025',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_lofi_night',
    name: 'Late Night Lofi Beats',
    itemCount: 18,
    query: 'lofi hip hop beats to sleep chill',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_acoustic_sore',
    name: 'Akustik Santai Sore',
    itemCount: 22,
    query: 'lagu akustik indonesia santai sore',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&auto=format&fit=crop&q=80'
  }
];

// Fetch categorized music from YouTube Music (Beranda, New, Charts, Albums)
export async function fetchCategoryTracks(type) {
  try {
    const res = await fetch(`/api/search?type=${encodeURIComponent(type)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('fetchCategoryTracks error:', err);
  }
  return [];
}

// Search songs using Google official API first, then local backend, then fallback
export async function searchSongs(query, googleToken = null) {
  if (!query || !query.trim()) return [];

  // 1. Try server search endpoint (/api/search) first - fastest Innertube search
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

  // 2. If user has Google Token, try official YouTube Data API
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
