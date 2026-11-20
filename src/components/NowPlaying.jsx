import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  ListMusic, 
  Search, 
  Airplay, 
  Heart,
  Menu
} from 'lucide-react';
import MarqueeText from './MarqueeText';
import MiniVisualizer from './MiniVisualizer';
import CompactLyrics from './CompactLyrics';
import JumpInLogo from './JumpInLogo';

export default function NowPlaying({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLiked = false,
  onToggleLike,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onOpenSearch,
  onOpenQueue,
  onOpenDrawer,
}) {
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingTime = duration > 0 ? Math.max(0, duration - currentTime) : 0;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      {/* 1. LAYER BAWAH: Full Screen Album Cover */}
      <div className="absolute inset-0 z-0">
        <img
          src={track.cover}
          alt={track.title}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isPlaying ? 'scale-105' : 'scale-100'
          }`}
        />
        {/* Subtle Ambient blur for text readability */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/15" />
      </div>

      {/* 2. LAYER SHADOW ATAS: Top gradient vignette for safe header icons */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* 3. LAYER SHADOW BAWAH: Dark Gradient Shadow from bottom up */}
      <div className="absolute bottom-0 inset-x-0 h-[75%] bg-gradient-to-t from-black via-black/85 via-45% to-transparent z-10 pointer-events-none" />

      {/* TOP HEADER: Apple-style Status/Nav Bar */}
      <header className="relative z-20 flex items-center justify-between px-5 safe-top">
        {/* Left: Sidebar Menu Drawer Toggle (Like the uploaded menu) */}
        <button 
          onClick={onOpenDrawer}
          className="p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 active:scale-95 transition text-white/80 hover:text-white"
          title="Open Library Menu"
        >
          <Menu size={20} />
        </button>

        {/* Center: Brand Pill */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-xl border border-white/10">
          <JumpInLogo size={15} />
          <span className="text-xs font-semibold tracking-wider uppercase text-white/90">Jump<span className="text-rose-500">In</span></span>
        </div>

        {/* Right: Mini Visualizer & Search Button */}
        <div className="flex items-center space-x-2">
          {/* Mini Cute Audio Visualizer in top right corner */}
          <MiniVisualizer isPlaying={isPlaying} />

          <button 
            onClick={onOpenSearch}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 active:scale-95 transition text-white/80 hover:text-white"
            title="Search YouTube Music"
          >
            <Search size={20} />
          </button>
        </div>
      </header>

      {/* 4. LAYER KONTROL PEMUTAR: On top of dark bottom shadow */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col px-6 safe-bottom space-y-4">
        {/* COMPACT LYRICS (Placed right above the song title) */}
        <CompactLyrics track={track} currentTime={currentTime} />

        {/* Track Info (Title with Marquee Running Text, Artist with Marquee, Like Button) */}
        <div className="flex items-end justify-between">
          <div className="flex-1 pr-4 min-w-0">
            {/* Running text for song title when long */}
            <MarqueeText 
              text={track.title} 
              className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md"
              maxChars={20}
            />
            {/* Running text for artist name when long */}
            <MarqueeText 
              text={track.artist} 
              className="text-base md:text-lg font-medium text-white/70 tracking-wide mt-0.5"
              maxChars={24}
            />
          </div>

          <button 
            onClick={onToggleLike}
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 active:scale-90 transition shrink-0"
            title={isLiked ? "Unlike Song" : "Like Song"}
          >
            <Heart 
              size={22} 
              className={isLiked ? "fill-rose-500 text-rose-500" : "text-white/80"} 
            />
          </button>
        </div>

        {/* Progress Bar / Seek Scrubber (Apple Style) */}
        <div className="space-y-1.5">
          <div className="relative flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs font-mono font-medium text-white/50 tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Main Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
        <div className="flex items-center justify-between px-2 pt-0.5">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 transition ${isShuffle ? 'text-rose-500' : 'text-white/50 hover:text-white'}`}
          >
            <Shuffle size={20} />
          </button>

          <button 
            onClick={onPrev}
            className="p-3 text-white/80 hover:text-white active:scale-90 transition"
          >
            <SkipBack size={32} />
          </button>

          {/* Primary Apple Music Play/Pause Button */}
          <button 
            onClick={onPlayPause}
            className="w-18 h-18 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-white/20 active:scale-95 transition transform hover:scale-105"
            style={{ width: '4.25rem', height: '4.25rem' }}
          >
            {isPlaying ? (
              <Pause size={30} className="fill-black text-black" />
            ) : (
              <Play size={30} className="fill-black text-black ml-1" />
            )}
          </button>

          <button 
            onClick={onNext}
            className="p-3 text-white/80 hover:text-white active:scale-90 transition"
          >
            <SkipForward size={32} />
          </button>

          <button 
            onClick={() => setRepeatMode((repeatMode + 1) % 3)}
            className={`p-2 transition ${repeatMode > 0 ? 'text-rose-500' : 'text-white/50 hover:text-white'}`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Apple Glass Bottom Toolbar (Volume, Airplay, Queue) */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 shadow-lg">
          {/* Volume Control */}
          <div className="flex items-center space-x-2.5 flex-1 max-w-[140px]">
            <button onClick={onToggleMute} className="text-white/70 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 text-white/70">
            <button 
              className="p-1.5 rounded-lg hover:text-white transition"
              title="AirPlay / Speaker"
            >
              <Airplay size={18} />
            </button>

            <button 
              onClick={onOpenQueue}
              className="p-1.5 rounded-lg hover:text-white transition"
              title="Playlist Queue"
            >
              <ListMusic size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
