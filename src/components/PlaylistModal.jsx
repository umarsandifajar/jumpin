import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Shuffle, 
  Heart, 
  Music, 
  Loader2, 
  LayoutGrid, 
  List, 
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';

export default function PlaylistModal({
  isOpen,
  onClose,
  title,
  subtitle,
  tracks = [],
  loading = false,
  onPlayTrack,
  onPlayAll,
  isLikedView = false,
  currentTrackId = null,
  isPlaying = false
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Instagram style) or 'list'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-4 sm:px-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            {isLikedView ? (
              <Heart size={20} className="fill-white text-white" />
            ) : title.toLowerCase().includes('trending') ? (
              <Flame size={20} className="text-white" />
            ) : (
              <Music size={20} className="text-white" />
            )}
          </div>
          <div className="truncate">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">{title}</h2>
            <p className="text-xs text-white/50 truncate">
              {loading ? 'Memuat lagu...' : `${tracks.length} lagu • ${subtitle || 'YouTube Music'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* View Mode Toggle: Grid (Instagram) vs List */}
          <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Tampilan Kotak Instagram (Grid)"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Tampilan Daftar (List)"
            >
              <List size={15} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white active:scale-95 transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons: Play All & Shuffle */}
      {!loading && tracks.length > 0 && (
        <div className="flex items-center space-x-3 py-3.5 shrink-0">
          <button
            onClick={() => {
              if (onPlayAll) onPlayAll(tracks, false);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 active:scale-98 transition"
          >
            <Play size={16} className="fill-white" />
            <span>Putar Semua ({tracks.length})</span>
          </button>
          <button
            onClick={() => {
              if (onPlayAll) onPlayAll(tracks, true);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-98 transition text-white font-semibold text-xs sm:text-sm border border-white/10 backdrop-blur-xl"
          >
            <Shuffle size={15} />
            <span>Acak (Shuffle)</span>
          </button>
        </div>
      )}

      {/* Content Container (Scrollable with Ultra-Sleek Scrollbar) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-12 pt-1 select-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-white/60">
            <div className="relative">
              <Loader2 size={40} className="animate-spin text-rose-500 mb-3" />
              <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
            </div>
            <p className="text-sm font-medium">Mengambil lagu terbaru dari YouTube...</p>
            <p className="text-xs text-white/40 mt-1">Direct stream tanpa iklan</p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-24 text-white/40 text-sm">
            {isLikedView ? (
              <>
                <Heart size={44} className="mx-auto mb-3 opacity-25 text-rose-500" />
                <p className="font-semibold text-white/70">Belum ada lagu disukai</p>
                <p className="text-xs text-white/40 mt-1">Tekan ikon hati pada lagu apa saja untuk menyimpannya di sini</p>
              </>
            ) : (
              <>
                <Music size={44} className="mx-auto mb-3 opacity-25" />
                <p className="font-semibold text-white/70">Daftar putar masih kosong</p>
              </>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ========================================================== */
          /* INSTAGRAM EXPLORE STYLE GRID VIEW (Kotak-Kotak Modern)    */
          /* ========================================================== */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {tracks.map((item, idx) => {
              const isItemActive = currentTrackId === item.id;
              const isTopThree = idx < 3;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    onPlayTrack(item);
                    onClose();
                  }}
                  className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer border transition-all duration-300 active:scale-[0.97] bg-[#1a1a1e] ${
                    isItemActive
                      ? 'border-rose-500 shadow-xl shadow-rose-500/30 ring-2 ring-rose-500/40'
                      : 'border-white/10 hover:border-rose-500/60 hover:shadow-xl hover:shadow-black/60'
                  }`}
                >
                  {/* High Quality Album Cover Art */}
                  <img
                    src={item.cover}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />

                  {/* Top Floating Badges: Rank & Duration */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    {/* Rank Badge */}
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md backdrop-blur-md ${
                        isTopThree
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                          : 'bg-black/60 text-white/80 border border-white/10'
                      }`}
                    >
                      #{idx + 1}
                    </span>

                    {/* Duration / HD Badge */}
                    {item.duration && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-black/60 text-white/80 backdrop-blur-md border border-white/10">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {/* Dark Vignette Bottom Shadow for Title Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-45% to-transparent pointer-events-none" />

                  {/* Center Play Button Overlay on Hover / Active */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="w-11 h-11 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 transform group-hover:scale-105 active:scale-95 transition backdrop-blur-md">
                      <Play size={18} className="fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Song Info */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                    <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
                      {item.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/70 truncate mt-0.5 drop-shadow">
                      {item.artist}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================== */
          /* CLASSIC COMPACT LIST VIEW                                  */
          /* ========================================================== */
          <div className="space-y-1.5">
            {tracks.map((item, idx) => {
              const isItemActive = currentTrackId === item.id;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    onPlayTrack(item);
                    onClose();
                  }}
                  className={`flex items-center p-2.5 rounded-2xl transition cursor-pointer group border ${
                    isItemActive
                      ? 'bg-rose-500/15 border-rose-500/40 text-white'
                      : 'border-transparent hover:bg-white/10 hover:border-white/10 text-white/90'
                  }`}
                >
                  <span className="text-xs font-bold text-white/30 w-7 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden mr-3 shrink-0 shadow-md">
                    <img
                      src={item.cover}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {isItemActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-semibold truncate text-white">{item.title}</p>
                    <p className="text-xs text-white/60 truncate mt-0.5">{item.artist}</p>
                  </div>
                  {item.duration && (
                    <span className="text-xs text-white/40 mr-2 shrink-0 font-mono">
                      {item.duration}
                    </span>
                  )}
                  <button className="p-2 rounded-full bg-white/10 text-white/80 group-hover:bg-rose-500 group-hover:text-white transition shrink-0">
                    <Play size={13} className="fill-current ml-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
