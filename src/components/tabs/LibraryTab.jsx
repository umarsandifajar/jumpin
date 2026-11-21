import React, { useState } from 'react';
import { 
  ListMusic, 
  Mic2, 
  Disc, 
  Music, 
  ChevronRight, 
  X, 
  SlidersHorizontal,
  CheckCircle2,
  LogIn
} from 'lucide-react';

export default function LibraryTab({
  user,
  onOpenAuth,
  onOpenPlaylists,
  onOpenArtists,
  onOpenAlbums,
  onOpenLikedSongs
}) {
  const [showSyncBanner, setShowSyncBanner] = useState(true);

  const libraryItems = [
    {
      id: 'playlists',
      label: 'Playlists',
      icon: ListMusic,
      onClick: onOpenPlaylists
    },
    {
      id: 'artists',
      label: 'Artists',
      icon: Mic2,
      onClick: onOpenArtists
    },
    {
      id: 'albums',
      label: 'Albums',
      icon: Disc,
      onClick: onOpenAlbums
    },
    {
      id: 'songs',
      label: 'Songs',
      icon: Music,
      onClick: onOpenLikedSongs
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Library' + Edit Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tight">Library</h1>
        <div className="flex items-center space-x-1.5 p-1 rounded-full bg-white/10 border border-white/10 text-white/80">
          <button className="p-1 rounded-full hover:text-white active:scale-95 transition">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Sync Banner (Matches Screenshot 1) */}
      {showSyncBanner && (
        <div className="mt-4 p-4 rounded-2xl bg-[#1c1c1e] border border-white/10 flex items-start justify-between shadow-lg">
          <div className="pr-4">
            <p className="text-sm font-semibold text-white">
              {user ? 'Library tersinkronisasi dengan Google' : 'Sync your library across all your devices.'}
            </p>
            {user ? (
              <p className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center space-x-1">
                <CheckCircle2 size={13} />
                <span>Terhubung: {user.email || user.name}</span>
              </p>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-[#007AFF] hover:underline mt-1.5 flex items-center space-x-1"
              >
                <LogIn size={12} />
                <span>Turn On</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSyncBanner(false)}
            className="p-1 rounded-full bg-white/10 text-white/50 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Library Menu Rows (Matches Screenshot 1 - NO Downloaded menu) */}
      <div className="mt-6 divide-y divide-white/10">
        {libraryItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center justify-between py-4 hover:bg-white/5 active:bg-white/10 transition px-1 group text-left"
            >
              <div className="flex items-center space-x-4">
                <Icon size={22} className="text-[#007AFF]" />
                <span className="text-base font-semibold text-white tracking-tight">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={18} className="text-white/30 group-hover:text-white/70 transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
