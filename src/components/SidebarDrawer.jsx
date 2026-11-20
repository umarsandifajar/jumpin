import React from 'react';
import { 
  Search, 
  Home, 
  Flame, 
  Clock, 
  Mic2, 
  Music, 
  User, 
  Heart, 
  X,
  LogOut,
  LogIn,
  Library
} from 'lucide-react';
import JumpInLogo from './JumpInLogo';

export default function SidebarDrawer({ 
  isOpen, 
  onClose, 
  onOpenSearch, 
  onOpenQueue,
  onOpenLikedMusic,
  onOpenTrending,
  onOpenArtists,
  onOpenAuth,
  onSelectPlaylist,
  playlists = [],
  user,
  onSignOut,
  likedTracksCount = 0 
}) {
  if (!isOpen) return null;

  const userName = user?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Music Fan';
  const userAvatar = user?.avatar || user?.user_metadata?.avatar_url;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in transition-opacity"
      />

      {/* Drawer Content */}
      <aside className="relative w-[305px] max-w-[85vw] h-full bg-[#161618]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col safe-top safe-bottom p-5 text-white z-10 shadow-2xl animate-slide-up">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center p-1">
              <JumpInLogo size={22} />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">Jump<span className="text-rose-500">In</span></h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="my-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          {user ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover border border-white/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-sm text-white">
                  {userName[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-rose-400 font-medium truncate">YouTube Connected</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Guest Mode</p>
                <p className="text-[10px] text-white/50">Login with Google</p>
              </div>
            </div>
          )}

          {user ? (
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/10 transition"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-95 transition flex items-center space-x-1"
            >
              <LogIn size={13} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Menu Navigation List (Mirrors YouTube Music Structure) */}
        <div className="flex-1 overflow-y-auto py-2 space-y-5 select-none">
          {/* Top Primary Actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/80 hover:text-white font-medium text-sm text-left"
            >
              <Search size={18} className="text-white/70" />
              <span>Search / Cari Musik</span>
            </button>

            <button
              onClick={onClose}
              className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm text-left"
            >
              <Home size={18} className="text-rose-500" />
              <span>Beranda (Home)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenTrending) onOpenTrending();
              }}
              className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/80 hover:text-white font-medium text-sm text-left"
            >
              <Flame size={18} className="text-amber-400" />
              <span>Trending & Baru (Explore)</span>
            </button>
          </div>

          {/* Section: Library / Koleksi Saya */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Library size={14} />
              <span>Koleksi YouTube</span>
            </div>

            {/* Liked Music */}
            <button
              onClick={() => {
                onClose();
                onOpenLikedMusic();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/85 hover:text-white font-medium text-sm text-left"
            >
              <div className="flex items-center space-x-3.5">
                <Heart size={18} className="text-rose-500 fill-rose-500/20" />
                <span>Lagu Disukai (Liked Music)</span>
              </div>
              {likedTracksCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold">
                  {likedTracksCount}
                </span>
              )}
            </button>

            {/* Subscribed Artists */}
            <button
              onClick={() => {
                onClose();
                if (onOpenArtists) onOpenArtists();
              }}
              className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/80 hover:text-white font-medium text-sm text-left"
            >
              <Mic2 size={18} className="text-white/70" />
              <span>Artis yang Diikuti</span>
            </button>

            {/* Recently Played History */}
            <button
              onClick={() => {
                onClose();
                onOpenQueue();
              }}
              className="w-full flex items-center space-x-3.5 px-3 py-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/80 hover:text-white font-medium text-sm text-left"
            >
              <Clock size={18} className="text-white/70" />
              <span>Riwayat Putar (History)</span>
            </button>
          </div>

          {/* Section: Real User YouTube Playlists */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-white/40 mb-1.5">
              Daftar Putar Saya ({playlists.length})
            </p>

            {playlists && playlists.length > 0 ? (
              <div className="space-y-1">
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      onClose();
                      if (onSelectPlaylist) onSelectPlaylist(pl);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 active:bg-white/15 transition text-white/85 hover:text-white font-medium text-xs text-left group"
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <img src={pl.cover} alt={pl.name} className="w-7 h-7 rounded-lg object-cover shadow-sm shrink-0" />
                      <span className="truncate">{pl.name}</span>
                    </div>
                    <span className="text-[11px] text-white/40 shrink-0 font-mono">{pl.itemCount}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-xs text-white/40 italic">
                {user ? 'Belum ada playlist di akun YouTube' : 'Login Google untuk memuat playlist'}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
          <span>v.13 - Fajar Umarsandi</span>
          <span>Apple PWA</span>
        </div>
      </aside>
    </div>
  );
}
