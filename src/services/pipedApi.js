import { searchYouTubeOfficial } from './youtubeAuth';

export const INITIAL_TRACKS = [
  {
    id: 'yjnSX_iUFVo',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    cover: 'https://i.ytimg.com/vi/yjnSX_iUFVo/hqdefault.jpg',
    duration: 195,
    isStream: true
  },
  {
    id: 'AQpEIZ8dNcU',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    cover: 'https://i.ytimg.com/vi/AQpEIZ8dNcU/hqdefault.jpg',
    duration: 235,
    isStream: true
  },
  {
    id: 'V9PVRfjEBTI',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    cover: 'https://i.ytimg.com/vi/V9PVRfjEBTI/hqdefault.jpg',
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
  }
];

// 1. Kurasi Khusus: New Music (Lagu-lagu Baru Terpopuler 2026 - Verified Working YouTube IDs)
export const NEW_MUSIC_TRACKS = [
  {
    id: 'yjnSX_iUFVo',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Sialnya, Hidup Harus Tetap Berjalan',
    cover: 'https://i.ytimg.com/vi/yjnSX_iUFVo/hqdefault.jpg',
    duration: 195,
    isStream: true
  },
  {
    id: 'AQpEIZ8dNcU',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'MARKERS AND SUCH PENS FLASHDISKS',
    cover: 'https://i.ytimg.com/vi/AQpEIZ8dNcU/hqdefault.jpg',
    duration: 235,
    isStream: true
  },
  {
    id: 'V9PVRfjEBTI',
    title: 'BIRDS OF A FEATHER',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    cover: 'https://i.ytimg.com/vi/V9PVRfjEBTI/hqdefault.jpg',
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
    id: 'kPa7bsKwL-c',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Die With A Smile',
    cover: 'https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    duration: 251,
    isStream: true
  },
  {
    id: 'cWrSjCZ5AeE',
    title: 'Evaluasi',
    artist: 'Hindia',
    album: 'Menari Dengan Bayangan',
    cover: 'https://i.ytimg.com/vi/cWrSjCZ5AeE/hqdefault.jpg',
    duration: 170,
    isStream: true
  }
];

// 2. Kurasi Khusus: Chill Music (Lagu-lagu Santai, Akustik & Sore Hari - Verified Working YouTube IDs)
export const CHILL_MUSIC_TRACKS = [
  {
    id: 'gIsoLyQX7W8',
    title: 'Rayuan Perempuan Gila',
    artist: 'Nadin Amizah',
    album: 'Untuk Dunia, Cinta, dan Kotornya',
    cover: 'https://i.ytimg.com/vi/gIsoLyQX7W8/hqdefault.jpg',
    duration: 320,
    isStream: true
  },
  {
    id: '_N6vSc_mT6I',
    title: 'Hati-Hati di Jalan',
    artist: 'Tulus',
    album: 'Manusia',
    cover: 'https://i.ytimg.com/vi/_N6vSc_mT6I/hqdefault.jpg',
    duration: 242,
    isStream: true
  },
  {
    id: 'oIYWenB637c',
    title: 'To the Bone',
    artist: 'Pamungkas',
    album: 'Flying Solo',
    cover: 'https://i.ytimg.com/vi/oIYWenB637c/hqdefault.jpg',
    duration: 344,
    isStream: true
  },
  {
    id: 'ba-XAIskH_g',
    title: 'Lantas',
    artist: 'Juicy Luicy',
    album: 'Sentimental',
    cover: 'https://i.ytimg.com/vi/ba-XAIskH_g/hqdefault.jpg',
    duration: 230,
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

// 3. Kurasi Khusus: Trending YouTube Indonesia Saat Ini (Verified Working YouTube IDs)
export const TRENDING_TRACKS = [
  {
    id: 's525A0Bc3z4',
    title: 'Sigar',
    artist: 'Denny Caknan',
    album: 'Trending #1 YouTube',
    cover: 'https://i.ytimg.com/vi/s525A0Bc3z4/hqdefault.jpg',
    duration: 305,
    isStream: true
  },
  {
    id: 'yjnSX_iUFVo',
    title: 'Satu Bulan',
    artist: 'Bernadya',
    album: 'Top Chart Indonesia',
    cover: 'https://i.ytimg.com/vi/yjnSX_iUFVo/hqdefault.jpg',
    duration: 195,
    isStream: true
  },
  {
    id: 'AQpEIZ8dNcU',
    title: 'Gala Bunga Matahari',
    artist: 'Sal Priadi',
    album: 'Viral YouTube Music',
    cover: 'https://i.ytimg.com/vi/AQpEIZ8dNcU/hqdefault.jpg',
    duration: 235,
    isStream: true
  },
  {
    id: 'kPa7bsKwL-c',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    album: 'Top Hits Global',
    cover: 'https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    duration: 251,
    isStream: true
  },
  {
    id: '9hjMIOIysng',
    title: 'Kata Mereka Ini Berlebihan',
    artist: 'Bernadya',
    album: 'Trending YouTube Music',
    cover: 'https://i.ytimg.com/vi/9hjMIOIysng/hqdefault.jpg',
    duration: 198,
    isStream: true
  },
  {
    id: 'VS5lU4iqdzc',
    title: 'Sekti',
    artist: 'Denny Caknan',
    album: 'Trending Musik Jawa',
    cover: 'https://i.ytimg.com/vi/VS5lU4iqdzc/hqdefault.jpg',
    duration: 280,
    isStream: true
  },
  {
    id: 'LAOxuo6pkdo',
    title: 'Mati-Matian',
    artist: 'Mahalini',
    album: 'Hits Populer Indonesia',
    cover: 'https://i.ytimg.com/vi/LAOxuo6pkdo/hqdefault.jpg',
    duration: 245,
    isStream: true
  },
  {
    id: 'nXOfv4-tT9o',
    title: 'Kini Mereka Tahu',
    artist: 'Bernadya',
    album: 'Hits Populer',
    cover: 'https://i.ytimg.com/vi/nXOfv4-tT9o/hqdefault.jpg',
    duration: 210,
    isStream: true
  },
  {
    id: 'fBnqChaU-ck',
    title: 'Wirang',
    artist: 'GuyonWaton',
    album: 'Trending Musik Campursari',
    cover: 'https://i.ytimg.com/vi/fBnqChaU-ck/hqdefault.jpg',
    duration: 260,
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
  
  if (type === 'new') return NEW_MUSIC_TRACKS;
  if (type === 'trending') return TRENDING_TRACKS;
  if (type === 'charts') return TRENDING_TRACKS;
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

  // Graceful fallback
  const lowerQuery = query.toLowerCase();
  const allKnown = [...NEW_MUSIC_TRACKS, ...CHILL_MUSIC_TRACKS, ...TRENDING_TRACKS];
  const matched = allKnown.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) || 
    t.artist.toLowerCase().includes(lowerQuery)
  );

  return matched.length > 0 ? matched : TRENDING_TRACKS;
}
