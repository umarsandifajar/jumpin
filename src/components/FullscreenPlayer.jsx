import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  MoreHorizontal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  MessageSquareQuote, 
  Airplay, 
  ListMusic, 
  Heart 
} from 'lucide-react';
import { getLyricsForTrack } from '../services/lyricsService';

export default function FullscreenPlayer({
  isOpen,
  onClose,
  track,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  isLiked,
  onToggleLike,
  onOpenQueue
}) {
  const [showLyrics, setShowLyrics] = useState(true);
  const lyricsContainerRef = useRef(null);

  if (!isOpen || !track) return null;

  const lyricsText = getLyricsForTrack(track);
  const lyricsLines = lyricsText ? lyricsText.split('\n') : [];

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingTime = duration > 0 ? Math.max(0, duration - currentTime) : 0;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden animate-slide-up safe-top safe-bottom select-none">
      {/* 1. Dynamic Ambient Background Blur derived from Album Cover */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover scale-150 blur-3xl opacity-40 brightness-75 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 backdrop-blur-3xl" />
      </div>

      {/* 2. Top Drag Indicator Pill & Header */}
      <div className="relative z-10 px-6 pt-2 shrink-0">
        {/* Drag Handle Pill */}
        <div 
          onClick={onClose}
          className="w-full flex justify-center py-2 cursor-pointer active:opacity-60"
        >
          <div className="w-9 h-1 rounded-full bg-white/30" />
        </div>

        {/* Track Info Header (Album Thumbnail + Title + Artist + Actions) */}
        <div className="flex items-center justify-between mt-2 pb-4">
          <div className="flex items-center space-x-3.5 truncate pr-2">
            <img
              src={track.cover}
              alt={track.title}
              className="w-14 h-14 rounded-2xl object-cover shadow-xl border border-white/10 shrink-0"
            />
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-bold text-white truncate leading-tight">
                {track.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 truncate mt-0.5 font-medium">
                {track.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onToggleLike}
              className="p-2 rounded-full text-white/60 hover:text-rose-500 active:scale-90 transition"
              title="Like"
            >
              <Heart 
                size={22} 
                className={isLiked ? 'fill-rose-500 text-rose-500' : 'text-white/70'} 
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white active:scale-90 transition"
              title="Dismiss"
            >
              <MoreHorizontal size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Center Scrollable Lyrics Area (Matches Screenshot 3) */}
      <div 
        ref={lyricsContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-6 py-4 custom-scrollbar"
      >
        {showLyrics ? (
          <div className="space-y-4 max-w-lg mx-auto py-4">
            {lyricsLines.map((line, idx) => {
              const isSectionHeader = line.startsWith('[') && line.endsWith(']');
              const isEmpty = !line.trim();

              if (isEmpty) return <div key={idx} className="h-4" />;

              if (isSectionHeader) {
                return (
                  <p key={idx} className="text-sm font-semibold text-white/40 tracking-wider pt-3">
                    {line}
                  </p>
                );
              }

              return (
                <p
                  key={idx}
                  className="text-xl sm:text-2xl font-bold leading-relaxed text-white/95 hover:text-white transition-opacity duration-300 drop-shadow-sm"
                >
                  {line}
                </p>
              );
            })}
          </div>
        ) : (
          /* Large Album Art Artwork View if Lyrics Toggled Off */
          <div className="flex items-center justify-center h-full p-4">
            <div className="relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group">
              <img
                src={track.cover}
                alt={track.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Player Controls (No Volume Slider - Follows Phone Volume) */}
      <div className="relative z-10 px-6 pb-6 pt-2 shrink-0 max-w-lg mx-auto w-full">
        {/* Scrubber Progress Bar */}
        <div className="w-full">
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onSeek(ratio * duration);
            }}
            className="h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden py-1 group"
          >
            <div
              className="h-1 bg-white/90 rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Timers (Elapsed left, -Remaining right) */}
          <div className="flex justify-between items-center text-[11px] font-mono text-white/50 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Row */}
        <div className="flex items-center justify-center space-x-10 my-4">
          {/* Previous Track */}
          <button
            onClick={onPrev}
            className="p-3 text-white/80 hover:text-white active:scale-90 transition rounded-full"
            title="Previous"
          >
            <SkipBack size={30} className="fill-white/80 hover:fill-white" />
          </button>

          {/* Big Play / Pause */}
          <button
            onClick={onPlayPause}
            className="p-4 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition shadow-2xl shadow-white/20"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={34} className="fill-black text-black" />
            ) : (
              <Play size={34} className="fill-black text-black ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="p-3 text-white/80 hover:text-white active:scale-90 transition rounded-full"
            title="Next"
          >
            <SkipForward size={30} className="fill-white/80 hover:fill-white" />
          </button>
        </div>

        {/* Bottom Toolbar: Lyrics Toggle, AirPlay, Queue Modal */}
        <div className="flex items-center justify-between text-white/50 pt-2 px-6">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-full transition ${
              showLyrics ? 'text-white bg-white/20' : 'hover:text-white'
            }`}
            title="Toggle Lyrics"
          >
            <MessageSquareQuote size={20} />
          </button>

          <button
            onClick={() => alert('AirPlay / Bluetooth Audio follows your iPhone System Settings.')}
            className="p-2 rounded-full hover:text-white active:scale-95 transition"
            title="Audio Output"
          >
            <Airplay size={20} />
          </button>

          <button
            onClick={onOpenQueue}
            className="p-2 rounded-full hover:text-white active:scale-95 transition"
            title="Playing Queue"
          >
            <ListMusic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
