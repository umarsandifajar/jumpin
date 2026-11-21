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
    id: '1fTszV_n7L4',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    cover: 'https://i.ytimg.com/vi/1fTszV_n7L4/hqdefault.jpg',
    duration: 195,
    isStream: true
  },
  {
    id: '3JgE3G586s0',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    cover: 'https://i.ytimg.com/vi/3JgE3G586s0/hqdefault.jpg',
    duration: 235,
    isStream: true
  }
];

// 1. Kurasi Khusus: New Music (Lagu-lagu Baru Terpopuler 2026)
export const NEW_MUSIC_TRACKS = [
  {
    id: '1fTszV_n7L4',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    cover: 'https://i.ytimg.com/vi/1fTszV_n7L4/hqdefault.jpg',
    duration: 195,
    isStream: true
  },
  {
    id: '3JgE3G586s0',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    cover: 'https://i.ytimg.com/vi/3JgE3G586s0/hqdefault.jpg',
    duration: 235,
    isStream: true
  },
  {
    id: 'd5gxPgJNP3Y',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    cover: 'https://i.ytimg.com/vi/d5gxPgJNP3Y/hqdefault.jpg',
    duration: 190,
    isStream: true
  },
  {
    id: 'eVli-tstM5E',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: 'Short n\' Sweet',
    cover: 'https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg',
    duration: 175,
    isStream: true
  },
  {
    id: 'kPa7bsKwL-8',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Die With A Smile',
    cover: 'https://i.ytimg.com/vi/kPa7bsKwL-8/hqdefault.jpg',
    duration: 251,
    isStream: true
  },
  {
    id: 'b8H-L4088Zg',
    title: 'Too Much Of A Good Thing',
    artist: 'NIKI',
    album: 'Buzz',
    cover: 'https://i.ytimg.com/vi/b8H-L4088Zg/hqdefault.jpg',
    duration: 170,
    isStream: true
  }
];

// 2. Kurasi Khusus: Chill Music (Lagu-lagu Santai, Akustik & Sore Hari)
export const CHILL_MUSIC_TRACKS = [
  {
    id: 'w83y_oZf2nU',
    title: 'Rayuan Perempuan Gila',
    artist: 'Nadin Amizah',
    album: 'Untuk Dunia, Cinta, dan Kotornya',
    cover: 'https://i.ytimg.com/vi/w83y_oZf2nU/hqdefault.jpg',
    duration: 320,
    isStream: true
  },
  {
    id: 'FwA648T9v68',
    title: 'Hati-Hati di Jalan',
    artist: 'Tulus',
    album: 'Manusia',
    cover: 'https://i.ytimg.com/vi/FwA648T9v68/hqdefault.jpg',
    duration: 242,
    isStream: true
  },
  {
    id: '2rgepWg440k',
    title: 'To the Bone',
    artist: 'Pamungkas',
    album: 'Flying Solo',
    cover: 'https://i.ytimg.com/vi/2rgepWg440k/hqdefault.jpg',
    duration: 344,
    isStream: true
  },
  {
    id: 'Y2bE3X-gD2k',
    title: 'Bitterlove',
    artist: 'Ardhito Pramono',
    album: 'Craving',
    cover: 'https://i.ytimg.com/vi/Y2bE3X-gD2k/hqdefault.jpg',
    duration: 220,
    isStream: true
  },
  {
    id: 'o_4g9yE0xVs',
    title: 'Runtuh',
    artist: 'Feby Putri ft. Fiersa Besari',
    album: 'Riuh',
    cover: 'https://i.ytimg.com/vi/o_4g9yE0xVs/hqdefault.jpg',
    duration: 228,
    isStream: true
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Chill Beats',
    artist: 'Lofi Girl',
    album: 'Beats to Relax/Study to',
    cover: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg',
    duration: 180,
    isStream: true
  }
];

// 3. Kurasi Khusus: Trending YouTube Saat Ini
export const TRENDING_TRACKS = [
  {
    id: '8YQZg_y-J18',
    title: 'Sigar',
    artist: 'Denny Caknan',
    album: 'Sigar Single',
    cover: 'https://i.ytimg.com/vi/8YQZg_y-J18/hqdefault.jpg',
    duration: 305,
    isStream: true
  },
  {
    id: 'Z-XyB03U-3o',
    title: 'Kata Mereka Ini Berlebihan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    cover: 'https://i.ytimg.com/vi/Z-XyB03U-3o/hqdefault.jpg',
    duration: 198,
    isStream: true
  },
  {
    id: 'kPa7bsKwL-8',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Die With A Smile',
    cover: 'https://i.ytimg.com/vi/kPa7bsKwL-8/hqdefault.jpg',
    duration: 251,
    isStream: true
  },
  {
    id: 'xGg7_8k8pW4',
    title: 'Lantas',
    artist: 'Juicy Luicy',
    album: 'Sentimental',
    cover: 'https://i.ytimg.com/vi/xGg7_8k8pW4/hqdefault.jpg',
    duration: 230,
    isStream: true
  },
  {
    id: 'Wv7Z78tFk6U',
    title: 'Mati-Matian',
    artist: 'Mahalini',
    album: 'Mati-Matian Single',
    cover: 'https://i.ytimg.com/vi/Wv7Z78tFk6U/hqdefault.jpg',
    duration: 245,
    isStream: true
  },
  {
    id: 'bN0-Xk_zHrk',
    title: 'Kuingin Pisah',
    artist: 'Tiara Andini',
    album: 'Kuingin Pisah Single',
    cover: 'https://i.ytimg.com/vi/bN0-Xk_zHrk/hqdefault.jpg',
    duration: 215,
    isStream: true
  }
];

export const CURATED_YOUTUBE_PLAYLISTS = [
  {
    id: 'curated_indo_hits',
    name: 'Top Hits Indonesia 2026',
    itemCount: 25,
    query: 'top songs indonesia 2026 viral',
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
    query: 'todays top hits pop 2026',
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

// Fetch categorized music from YouTube Music
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

  if (googleToken) {
    try {
      const results = await searchYouTubeOfficial(query, googleToken);
      if (results && results.length > 0) {
        return results;
      }
    } catch (err) {
      console.warn('Google official search failed:', err);
    }
  }

  // Graceful fallback for offline / disconnected states
  const lowerQuery = query.toLowerCase();
  const allKnown = [...NEW_MUSIC_TRACKS, ...CHILL_MUSIC_TRACKS, ...TRENDING_TRACKS];
  const matched = allKnown.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) || 
    t.artist.toLowerCase().includes(lowerQuery)
  );

  return matched.length > 0 ? matched : TRENDING_TRACKS;
}
