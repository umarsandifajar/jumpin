import React from 'react';
import { Play, Pause, SkipForward, Radio } from 'lucide-react';

export default function MiniPlayer({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onOpenFullscreen
}) {
  if (!track) return null;

  const isLiveRadio = Boolean(track.isLive || track.isRadio || track.streamUrl);

  return (
    <div className="fixed bottom-[78px] inset-x-3 sm:inset-x-6 max-w-lg mx-auto z-40 pointer-events-auto animate-slide-up">
      <div 
        onClick={onOpenFullscreen}
        className="h-[58px] bg-[#252528]/95 backdrop-blur-3xl border border-white/10 rounded-2xl px-2.5 flex items-center justify-between shadow-2xl shadow-black/90 cursor-pointer active:scale-[0.99] transition-all group"
      >
        {/* Left: Album Cover + Title + Artist */}
        <div className="flex items-center space-x-3 truncate flex-1 min-w-0 pr-2">
          <div className="relative shrink-0">
            <img
              src={track.cover}
              alt={track.title}
              className="w-10 h-10 rounded-xl object-cover shadow-md border border-white/10 group-hover:scale-105 transition-transform"
            />
            {isLiveRadio && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-rose-600 text-[8px] font-bold text-white uppercase tracking-wider shadow">
                LIVE
              </span>
            )}
          </div>
          <div className="truncate">
            <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight flex items-center space-x-1">
              <span>{track.title || track.name}</span>
            </p>
            <p className="text-[11px] text-white/60 truncate mt-0.5 font-medium flex items-center space-x-1">
              {isLiveRadio && <Radio size={10} className="text-rose-400 shrink-0" />}
              <span className="truncate">{track.artist || track.frequency || 'Live Radio'}</span>
            </p>
          </div>
        </div>

        {/* Right: Controls (Play/Pause, Next) */}
        <div 
          className="flex items-center space-x-1 shrink-0"
          onClick={(e) => e.stopPropagation()} // Prevent opening fullscreen when tapping buttons
        >
          <button
            onClick={onPlayPause}
            className="p-2 text-white hover:text-white/80 active:scale-90 transition rounded-full"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={20} className="fill-white" />
            ) : (
              <Play size={20} className="fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-2 text-white/85 hover:text-white active:scale-90 transition rounded-full"
            title="Next Track"
          >
            <SkipForward size={20} className="fill-white/90" />
          </button>
        </div>
      </div>
    </div>
  );
}
