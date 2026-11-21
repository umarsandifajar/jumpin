// Dynamic Lyrics Service with Real LRCLIB API Integration + Preset Fallbacks

export const PRESET_LYRICS = {
  'cinta sepihak': `[Verse 1]
Kau lari pagi ku kejar tanpa alas
Kau sibuk tinggi ku tunggu di kelas
Kau anggap aku cuma figuran ampas
Cintaku tulus tapi tanpa kau balas

[Verse 2]
Surat cintaku jadi bungkus lagi
Kau buang jauh tak kau baca pasti
Kau cari pacar yang punya Ghéngsi
Aku yang tulus malah kau maki

[Chorus]
Cinta sepihak ini membunuhku perlahan
Kau tersenyum untuk orang lain di depan
Biar ku simpan rasa ini sendirian
Sampai waktu menghapus semua kenangan

[Outro]
Tak apa kau abaikan
Cintaku tetap bertahan
Meski hanya dalam angan`,

  'starboy': `[Verse 1]
I'm tryna put you in the worst mood, ah
P1 cleaner than your church shoes, ah
Milli point two just to hurt you, ah
All red Lamb' just to tease you, ah
None of these toys on lease too, ah
Made your whole year in a week too, yah
Main girl out your league too, ah
Side girl out of your league too, ah

[Chorus]
Look what you've done
I'm a starboy
Look what you've done
I'm a starboy

[Verse 2]
Every day a person try to test me, ah
Every day they try to end me, ah
Pull off in that Roadster sv, ah
Pockets overweight, gettin' hefty, ah`,

  'blinding lights': `[Verse 1]
Yeah, I've been tryna call
I've been on my own for long enough
Maybe you can show me how to love, maybe
I'm going through withdrawals
You don't even have to do too much
You can turn me on with just a touch, baby

[Chorus]
I look around and Sin City's cold and empty
No one's around to judge me
I can't see clearly when you're gone
I said, ooh, I'm blinded by the lights
No, I can't sleep until I feel your touch`
};

// In-memory cache for fast instant rendering on song re-open
const lyricsCache = new Map();

// Helper to strip timestamp tags [00:12.34] from synced lyrics
function cleanLrcTimestamps(lrcText) {
  if (!lrcText) return '';
  return lrcText
    .split('\n')
    .map(line => line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim())
    .join('\n');
}

// Clean title and artist to maximize LRCLIB search accuracy
export function cleanSongMetadata(title = '', artist = '') {
  let cleanTitle = title
    // Remove (Official Video), [Official Audio], (Lyrics), etc.
    .replace(/\s*[\(\[](official\s*music\s*video|official\s*video|official\s*audio|visualizer|audio|lyrics|lyric\s*video|hd|hq|4k|mv|remastered)[\)\]]/gi, '')
    // Remove "ft. X" or "feat. X" from title if present
    .replace(/\s*(feat\.?|ft\.?)\s+.*$/i, '')
    .trim();

  let cleanArtist = (artist || '')
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/\s*(feat\.?|ft\.?)\s+.*$/i, '')
    .trim();

  // If title is "Artist - Song Title", split them
  if (cleanTitle.includes(' - ')) {
    const parts = cleanTitle.split(' - ');
    if (parts.length >= 2) {
      if (!cleanArtist || cleanArtist === 'YouTube' || cleanArtist === 'JumpIn') {
        cleanArtist = parts[0].trim();
      }
      cleanTitle = parts.slice(1).join(' - ').trim();
    }
  }

  return { cleanTitle, cleanArtist };
}

/**
 * Fetch lyrics dynamically:
 * 1. Check local preset
 * 2. Check in-memory cache
 * 3. Fetch exact match from LRCLIB API
 * 4. Fetch search match from LRCLIB API
 */
export async function fetchLyricsForTrack(track) {
  if (!track) return null;

  // Radio broadcast handling
  if (track.isLive || track.isRadio) {
    return `[Live Radio Broadcast]
Sedang Mengudara Langsung dari Studio
${track.title || track.name}
${track.artist || track.frequency || ''}

${track.tagline || 'Live Streaming 24 Jam Non-stop'}
Selamat menikmati siaran musik JumpIn Radio!`;
  }

  const rawTitle = track.title || '';
  const rawArtist = track.artist || '';
  const cacheKey = `${rawTitle}__${rawArtist}`.toLowerCase();

  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey);
  }

  // 1. Check preset lyrics first
  const lowerTitle = rawTitle.toLowerCase();
  const lowerArtist = rawArtist.toLowerCase();
  for (const [key, text] of Object.entries(PRESET_LYRICS)) {
    if (lowerTitle.includes(key) || lowerArtist.includes(key)) {
      lyricsCache.set(cacheKey, text);
      return text;
    }
  }

  // 2. Fetch from LRCLIB API
  const { cleanTitle, cleanArtist } = cleanSongMetadata(rawTitle, rawArtist);

  try {
    // Attempt A: Exact match with track_name and artist_name
    if (cleanTitle && cleanArtist) {
      const exactUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
      const res = await fetch(exactUrl);
      if (res.ok) {
        const data = await res.json();
        const lyrics = data.plainLyrics || cleanLrcTimestamps(data.syncedLyrics);
        if (lyrics && lyrics.trim()) {
          lyricsCache.set(cacheKey, lyrics.trim());
          return lyrics.trim();
        }
      }
    }

    // Attempt B: Search endpoint with clean query
    const searchQuery = `${cleanTitle} ${cleanArtist}`.trim();
    if (searchQuery) {
      const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const list = await searchRes.json();
        if (Array.isArray(list) && list.length > 0) {
          const match = list.find(item => item.plainLyrics || item.syncedLyrics);
          if (match) {
            const lyrics = match.plainLyrics || cleanLrcTimestamps(match.syncedLyrics);
            if (lyrics && lyrics.trim()) {
              lyricsCache.set(cacheKey, lyrics.trim());
              return lyrics.trim();
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('LRCLIB fetch error:', err);
  }

  // 3. Fallback message if no lyrics found
  const notFoundMessage = `[Lyrics Not Available]
Lirik untuk "${cleanTitle || rawTitle}" belum tersedia di database LRCLIB.

Silakan nikmati alunan musik dari ${cleanArtist || rawArtist || 'JumpIn'}!`;

  lyricsCache.set(cacheKey, notFoundMessage);
  return notFoundMessage;
}
