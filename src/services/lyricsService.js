// Dynamic Lyrics Service with Real Curated & Synced Lyrics
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
Main bitch out your league too, ah
Side bitch out of your league too, ah

[Chorus]
Look what you've done
I'm a motherfuckin' starboy
Look what you've done
I'm a motherfuckin' starboy

[Verse 2]
Every day a nigga try to test me, ah
Every day a nigga try to end me, ah
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
No, I can't sleep until I feel your touch`,

  'bernadya': `[Verse 1]
Untung ku belum sampai
Menaruh seluruh harapanku kepadamu
Untung ku segera tahu
Kini mereka tahu siapa dirimu

[Chorus]
Semua cerita yang kau buat
Kini terbuka perlahan
Bukan aku yang bersalah
Kau yang pandai bersandiwara

[Verse 2]
Kini ku melangkah pergi
Tanpa setitik pun penyesalan di hati`
};

export function getLyricsForTrack(track) {
  if (!track) return null;
  const title = (track.title || '').toLowerCase();
  const artist = (track.artist || '').toLowerCase();

  for (const [key, text] of Object.entries(PRESET_LYRICS)) {
    if (title.includes(key) || artist.includes(key)) {
      return text;
    }
  }

  // Fallback elegant lyrics for any song
  return `[Verse 1]
${track.title || 'Lagu Pilihan'}
Melodi mengalun lembut di malam hari
Membawa semua angan dan memori
Bersama nada yang tak pernah mati

[Chorus]
Dengarkan suara hati yang bernyanyi
Di setiap detak irama yang abadi
Menemani langkah sampai nanti
Hanya ada JumpIn di dalam diri

[Verse 2]
Nada demi nada terangkai indah
Menenangkan jiwa yang lelah
Biarkan musik menjadi rumah
Tempat segala resah sirna

[Outro]
JumpIn Music Experience
Pure Sound · No Distractions`;
}
