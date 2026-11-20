import React from 'react';
import { X, Play, Shuffle, Heart, Music, Trash2 } from 'lucide-react';

export default function PlaylistModal({
  isOpen,
  onClose,
  title,
  subtitle,
  tracks = [],
  onPlayTrack,
  onPlayAll,
  isLikedView = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-5 text-white">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-700 flex items-center justify-center shadow-md">
            {isLikedView ? <Heart size={20} className="fill-white" /> : <Music size={20} />}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="text-xs text-white/50">{tracks.length} songs • {subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Action Buttons: Play All & Shuffle */}
      {tracks.length > 0 && (
        <div className="flex items-center space-x-3 py-4">
          <button
            onClick={() => {
              if (onPlayAll) onPlayAll(tracks, false);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white text-black font-semibold text-sm shadow hover:bg-white/90 active:scale-95 transition"
          >
            <Play size={16} className="fill-black" />
            <span>Play All</span>
          </button>
          <button
            onClick={() => {
              if (onPlayAll) onPlayAll(tracks, true);
              onClose();
            }}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition text-white font-semibold text-sm border border-white/10"
          >
            <Shuffle size={16} />
            <span>Shuffle</span>
          </button>
        </div>
      )}

      {/* Track List */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-10">
        {tracks.length === 0 ? (
          <div className="text-center py-24 text-white/40 text-sm">
            {isLikedView ? (
              <>
                <Heart size={44} className="mx-auto mb-3 opacity-20 text-rose-500" />
                <p>No liked songs yet</p>
                <p className="text-xs text-white/30 mt-1">Tap the heart icon on any song to save it here</p>
              </>
            ) : (
              <>
                <Music size={44} className="mx-auto mb-3 opacity-20" />
                <p>Playlist is empty</p>
              </>
            )}
          </div>
        ) : (
          tracks.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                onPlayTrack(item);
                onClose();
              }}
              className="flex items-center p-2.5 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group"
            >
              <span className="text-xs font-bold text-white/30 w-6 text-center mr-2">
                {idx + 1}
              </span>
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shadow mr-3 group-hover:scale-105 transition"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{item.title}</p>
                <p className="text-xs text-white/60 truncate mt-0.5">{item.artist}</p>
              </div>
              <button className="p-2 rounded-full bg-white/10 text-white/70 group-hover:bg-rose-500 group-hover:text-white transition">
                <Play size={14} className="fill-current" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
