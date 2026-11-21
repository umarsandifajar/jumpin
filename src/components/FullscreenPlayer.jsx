import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreHorizontal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  MessageSquareQuote, 
  Airplay, 
  ListMusic, 
  Heart,
  Loader2,
  Radio
} from 'lucide-react';
import { fetchLyricsForTrack } from '../services/lyricsService';

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
  const [lyricsText, setLyricsText] = useState('');
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const lyricsContainerRef = useRef(null);

  // Gesture Swipe-Down State
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentDragYRef = useRef(0);

  // Fetch real lyrics dynamically whenever track changes
  useEffect(() => {
    if (!isOpen || !track) return;
    let isMounted = true;
    setLoadingLyrics(true);

    fetchLyricsForTrack(track)
      .then((text) => {
        if (isMounted) {
          setLyricsText(text || '');
          setLoadingLyrics(false);
        }
      })
      .catch((err) => {
        console.warn('Lyrics fetch failed:', err);
        if (isMounted) setLoadingLyrics(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, track?.id, track?.title, track?.artist]);

  if (!isOpen || !track) return null;

  const isLiveRadio = Boolean(track.isLive || track.isRadio || track.streamUrl);
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

  // Swipe-down Handlers (Touch & Pointer)
  const handleDragStart = (clientY) => {
    startYRef.current = clientY;
    currentDragYRef.current = 0;
    setIsDragging(true);
  };

  const handleDragMove = (clientY) => {
    if (!isDragging) return;
    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) {
      currentDragYRef.current = deltaY;
      setDragY(deltaY);
    } else {
      currentDragYRef.current = 0;
      setDragY(0);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (currentDragYRef.current > 85) {
      // Close modal smoothly when swiped down beyond 85px
      setDragY(window.innerHeight);
      setTimeout(() => {
        onClose();
        setDragY(0);
      }, 220);
    } else {
      // Snap back to top
      setDragY(0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden safe-top safe-bottom select-none bg-black transition-transform duration-200"
      style={{
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        touchAction: 'pan-y'
      }}
      onPointerMove={(e) => isDragging && handleDragMove(e.clientY)}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragEnd}
    >
      {/* 1. Dynamic Ambient Background Blur derived from Album Cover */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover scale-150 blur-3xl opacity-40 brightness-75 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 backdrop-blur-3xl" />
      </div>

      {/* 2. Top Drag Indicator Pill & Header (Swipe down trigger area) */}
      <div
        className="relative z-10 px-6 pt-2 shrink-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => handleDragStart(e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
      >
        {/* iOS Drag Handle Pill */}
        <div 
          onClick={onClose}
          className="w-full flex justify-center py-2 active:opacity-60"
        >
          <div className="w-11 h-1.5 rounded-full bg-white/40 hover:bg-white/60 transition shadow" />
        </div>

        {/* Track Info Header (Album Thumbnail + Title + Artist + Actions) */}
        <div className="flex items-center justify-between mt-1 pb-4">
          <div className="flex items-center space-x-3.5 truncate pr-2">
            <div className="relative shrink-0">
              <img
                src={track.cover}
                alt={track.title}
                className="w-14 h-14 rounded-2xl object-cover shadow-xl border border-white/10"
              />
              {isLiveRadio && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-[9px] font-bold text-white uppercase tracking-wider shadow">
                  LIVE
                </span>
              )}
            </div>
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-bold text-white truncate leading-tight">
                {track.title}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 truncate mt-0.5 font-medium flex items-center space-x-1">
                {isLiveRadio && <Radio size={12} className="text-rose-400 mr-1 inline" />}
                <span>{track.artist}</span>
              </p>
            </div>
          </div>

          <div 
            className="flex items-center space-x-2 shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
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
        onTouchStart={(e) => {
          // If at the very top of lyrics, allow downward drag to pull down the sheet
          if (lyricsContainerRef.current?.scrollTop === 0) {
            handleDragStart(e.touches[0].clientY);
          }
        }}
      >
        {isLiveRadio ? (
          /* Live Radio Broadcast Animation */
          <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black tracking-widest uppercase">LIVE BROADCAST</span>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {track.name || track.title}
            </h2>
            <p className="text-sm font-semibold text-white/70 max-w-sm">
              {track.tagline || track.description || 'Siaran Langsung Radio 24 Jam Non-stop'}
            </p>

            {/* Soundwave Bars */}
            <div className="flex items-center justify-center space-x-1.5 h-16 pt-4">
              {[20, 42, 58, 30, 52, 24, 45, 60, 38, 22, 48, 26].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full animate-pulse"
                  style={{
                    height: isPlaying ? `${h}px` : '8px',
                    animationDuration: `${0.6 + (i % 4) * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        ) : showLyrics ? (
          /* Real Lyrics Display (LRCLIB Integration) */
          <div className="space-y-4 max-w-lg mx-auto py-4">
            {loadingLyrics ? (
              <div className="flex flex-col items-center justify-center py-28 text-white/50 space-y-3">
                <Loader2 size={32} className="animate-spin text-[#007AFF]" />
                <p className="text-xs font-semibold tracking-wider uppercase">
                  Memuat lirik dari LRCLIB...
                </p>
              </div>
            ) : lyricsLines.length > 0 ? (
              lyricsLines.map((line, idx) => {
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
              })
            ) : (
              <div className="text-center py-20 text-white/50">
                <p className="text-sm font-medium">Lirik belum tersedia untuk lagu ini.</p>
              </div>
            )}
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
      <div 
        className="relative z-10 px-6 pb-6 pt-2 shrink-0 max-w-lg mx-auto w-full"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* Scrubber Progress Bar or Live Badge */}
        {isLiveRadio ? (
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>SIARAN LANGSUNG • {track.frequency || 'RADIO ONLINE'}</span>
            </div>
            <span className="text-[11px] text-white/60">LIVE STREAM</span>
          </div>
        ) : (
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
        )}

        {/* Primary Playback Controls Row */}
        <div className="flex items-center justify-center space-x-10 my-4">
          {/* Previous Track */}
          <button
            onClick={onPrev}
            className="p-3 text-white/80 hover:text-white active:scale-90 transition rounded-full"
            title="Previous"
            disabled={isLiveRadio}
          >
            <SkipBack size={30} className={isLiveRadio ? 'fill-white/20 text-white/20' : 'fill-white/80 hover:fill-white'} />
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
            disabled={isLiveRadio}
          >
            <SkipForward size={30} className={isLiveRadio ? 'fill-white/20 text-white/20' : 'fill-white/80 hover:fill-white'} />
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
            disabled={isLiveRadio}
          >
            <MessageSquareQuote size={20} className={isLiveRadio ? 'opacity-30' : ''} />
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
