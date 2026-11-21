import React from 'react';
import { X, Play, ListMusic, ChevronRight, Sparkles, FolderHeart } from 'lucide-react';
import { 
  NEW_MUSIC_TRACKS, 
  CHILL_MUSIC_TRACKS, 
  TRENDING_TRACKS 
} from '../services/pipedApi';

export default function PlaylistsListModal({
  isOpen,
  onClose,
  user,
  userPlaylists = [],
  onOpenPlaylistTracks,
  onPlayPlaylist
}) {
  if (!isOpen) return null;

  const curatedPlaylists = [
    {
      id: 'pl_top_hits',
      title: 'Top Hits Indonesia 2026',
      subtitle: 'Lagu terpopuler & paling viral di chart Indonesia',
      itemCount: TRENDING_TRACKS.length,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      tracks: TRENDING_TRACKS
    },
    {
      id: 'pl_new_music',
      title: 'Rilis Baru 2026',
      subtitle: 'Bernadya, Sal Priadi, Billie Eilish, Sabrina Carpenter',
      itemCount: NEW_MUSIC_TRACKS.length,
      cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
      tracks: NEW_MUSIC_TRACKS
    },
    {
      id: 'pl_chill_vibes',
      title: 'Santai Sore & Akustik',
      subtitle: 'Nadin Amizah, Tulus, Pamungkas, Ardhito Pramono, Lofi',
      itemCount: CHILL_MUSIC_TRACKS.length,
      cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&auto=format&fit=crop&q=80',
      tracks: CHILL_MUSIC_TRACKS
    }
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-4 sm:px-6 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-lg shadow-[#007AFF]/25">
            <ListMusic size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Playlists</h2>
            <p className="text-xs text-white/50">Koleksi Daftar Putar Lagu</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white active:scale-95 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
        {/* Section 1: User's YouTube Playlists (If logged in) */}
        {user && userPlaylists.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FolderHeart size={16} className="text-rose-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Playlist YouTube Saya ({userPlaylists.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => onOpenPlaylistTracks(pl)}
                  className="flex items-center p-3 rounded-2xl bg-[#1c1c1e] border border-white/5 hover:bg-white/10 active:scale-[0.98] transition cursor-pointer group"
                >
                  <img
                    src={pl.cover || pl.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200'}
                    alt={pl.title || pl.name}
                    className="w-14 h-14 rounded-xl object-cover shadow mr-3 shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-[#007AFF] transition">
                      {pl.title || pl.name}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {pl.itemCount || pl.trackCount || 'Playlist YouTube'}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-white/30 group-hover:text-white transition shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Curated Playlists */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Playlist Pilihan JumpIn
            </h3>
          </div>

          <div className="space-y-3">
            {curatedPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => onOpenPlaylistTracks(pl)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c1c1e] border border-white/5 hover:border-white/20 active:scale-[0.98] transition cursor-pointer group shadow-lg"
              >
                <div className="flex items-center space-x-3.5 min-w-0 pr-3">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/10">
                    <img
                      src={pl.cover}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-white truncate leading-tight group-hover:text-[#007AFF] transition">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-white/55 truncate mt-1">
                      {pl.subtitle}
                    </p>
                    <p className="text-[11px] font-semibold text-rose-400 mt-0.5">
                      {pl.itemCount} Lagu Tersedia • Siap Putar
                    </p>
                  </div>
                </div>

                {/* Direct Play All Button on Card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPlayPlaylist) onPlayPlaylist(pl.tracks, 0);
                    onClose();
                  }}
                  className="w-10 h-10 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition shadow-lg flex items-center justify-center shrink-0 ml-2"
                  title="Putar Playlist Ini"
                >
                  <Play size={16} className="fill-black ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
