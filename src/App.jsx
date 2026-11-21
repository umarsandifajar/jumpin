import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import BottomTabBar from './components/BottomTabBar';
import MiniPlayer from './components/MiniPlayer';
import FullscreenPlayer from './components/FullscreenPlayer';
import HomeTab from './components/tabs/HomeTab';
import NewTab from './components/tabs/NewTab';
import RadioTab from './components/tabs/RadioTab';
import LibraryTab from './components/tabs/LibraryTab';
import SearchTab from './components/tabs/SearchTab';
import PlaylistModal from './components/PlaylistModal';
import QueueModal from './components/QueueModal';
import AuthModal from './components/AuthModal';
import { 
  INITIAL_TRACKS, 
  CURATED_YOUTUBE_PLAYLISTS, 
  NEW_MUSIC_TRACKS,
  CHILL_MUSIC_TRACKS,
  TRENDING_TRACKS,
  fetchCategoryTracks, 
  searchSongs 
} from './services/pipedApi';
import { 
  getSavedSession, 
  logoutGoogle, 
  fetchPlaylistTracks, 
  fetchTrendingMusic, 
  fetchSubscribedArtists 
} from './services/youtubeAuth';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'new' | 'radio' | 'library' | 'search'
  const [isPlayerOpen, setIsPlayerOpen] = useState(false); // Fullscreen Lyrics Player

  // Player State
  const [queue, setQueue] = useState(INITIAL_TRACKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Content Feeds
  const [trendingTracks, setTrendingTracks] = useState(TRENDING_TRACKS);
  const [newTracks, setNewTracks] = useState(NEW_MUSIC_TRACKS);
  const [radioTracks, setRadioTracks] = useState([]);

  // Google / YouTube Session
  const [user, setUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modal State for Playlists & Queues
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const audioRef = useRef(null);
  const radioAudioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const currentTrack = queue[currentIndex] || INITIAL_TRACKS[0];

  // 1. Restore Google Session & Cache on Mount
  useEffect(() => {
    const session = getSavedSession();
    if (session && session.profile) {
      setUser(session.profile);
      setGoogleToken(session.token);
      if (session.playlists) setUserPlaylists(session.playlists);
      if (session.liked) setLikedTracks(session.liked);
    }

    // Preload music feeds for Home, New, and Radio tabs
    const loadFeeds = async () => {
      try {
        const [trend, latest, radio] = await Promise.all([
          fetchCategoryTracks('trending'),
          fetchCategoryTracks('new'),
          fetchCategoryTracks('charts')
        ]);
        if (trend && trend.length > 0) setTrendingTracks(trend);
        if (latest && latest.length > 0) setNewTracks(latest);
        if (radio && radio.length > 0) setRadioTracks(radio);
      } catch (err) {
        console.warn('Feed load error:', err);
      }
    };
    loadFeeds();
  }, []);

  // 2. Initialize YouTube Iframe Player Engine
  useEffect(() => {
    const initYT = () => {
      if (!window.YT || !window.YT.Player || ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player('jumpin-yt-engine', {
          height: '200',
          width: '200',
          videoId: currentTrack.id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(100);
            },
            onStateChange: (event) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
              } else if (event.data === 2) {
                setIsPlaying(false);
                if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
              } else if (event.data === 0) {
                handleNext();
              }
            },
            onError: (err) => {
              console.warn('YouTube Engine Error:', err);
            }
          }
        });
      } catch (err) {
        console.warn('Failed to initialize YouTube Player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady = initYT;
    }
  }, []);

  // 3. Sync track changes with YouTube Engine & MediaSession
  useEffect(() => {
    const isLiveRadio = Boolean(currentTrack?.isLive || currentTrack?.isRadio || currentTrack?.streamUrl);
    
    if (!isLiveRadio) {
      if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
        try {
          ytPlayerRef.current.loadVideoById(currentTrack.id);
          if (isPlaying) {
            ytPlayerRef.current.playVideo();
          }
        } catch (err) {
          console.warn('Error loading video into YT Engine:', err);
        }
      }
    }
    updateMediaSession(currentTrack);
  }, [currentIndex, currentTrack?.id]);

  // 4. Smooth Scrubber Interval from YouTube Player Engine
  useEffect(() => {
    let interval = null;
    const isLiveRadio = Boolean(currentTrack?.isLive || currentTrack?.isRadio || currentTrack?.streamUrl);

    if (isPlaying && !isLiveRadio) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          try {
            const cur = ytPlayerRef.current.getCurrentTime() || 0;
            const dur = ytPlayerRef.current.getDuration() || 0;
            if (!isNaN(cur) && cur >= 0) setCurrentTime(cur);
            if (!isNaN(dur) && dur > 0) setDuration(dur);
          } catch {
            // ignore periodic cross-frame read issues
          }
        }
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack?.id]);

  // iOS Lock Screen & Dynamic Island MediaSession Integration
  const updateMediaSession = (track) => {
    if ('mediaSession' in navigator && track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || track.name,
        artist: track.artist || track.frequency || 'JumpIn',
        album: track.album || track.tagline || 'JumpIn',
        artwork: [
          { src: track.cover, sizes: '512x512', type: 'image/jpeg' },
          { src: track.cover, sizes: '192x192', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => handlePlay());
      navigator.mediaSession.setActionHandler('pause', () => handlePause());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          handleSeek(details.seekTime);
        }
      });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';

    const isLiveRadio = Boolean(currentTrack?.isLive || currentTrack?.isRadio || currentTrack?.streamUrl);

    if (isLiveRadio) {
      if (radioAudioRef.current) {
        if (!radioAudioRef.current.src) {
          radioAudioRef.current.src = currentTrack.streamUrl;
        }
        radioAudioRef.current.play().catch(console.warn);
      }
    } else {
      if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
        ytPlayerRef.current.playVideo();
      }
    }

    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';

    const isLiveRadio = Boolean(currentTrack?.isLive || currentTrack?.isRadio || currentTrack?.streamUrl);

    if (isLiveRadio) {
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
      }
    } else {
      if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
        ytPlayerRef.current.pauseVideo();
      }
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIdx);
    setCurrentTime(0);
    handleSelectTrack(queue[nextIdx]);
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      handleSeek(0);
    } else {
      const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIdx);
      setCurrentTime(0);
      handleSelectTrack(queue[prevIdx]);
    }
  };

  const handleSeek = (newTime) => {
    const isLiveRadio = Boolean(currentTrack?.isLive || currentTrack?.isRadio || currentTrack?.streamUrl);
    if (isLiveRadio) return; // Cannot seek live stream

    setCurrentTime(newTime);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (err) {
        console.warn('Seek error:', err);
      }
    }
  };

  const handleSelectTrack = (selectedTrack) => {
    const isLiveRadio = Boolean(selectedTrack.isLive || selectedTrack.isRadio || selectedTrack.streamUrl);

    const existingIndex = queue.findIndex(t => t.id === selectedTrack.id);
    if (existingIndex !== -1) {
      setCurrentIndex(existingIndex);
    } else {
      const newQueue = [selectedTrack, ...queue];
      setQueue(newQueue);
      setCurrentIndex(0);
    }
    setIsPlaying(true);
    setCurrentTime(0);

    if (isLiveRadio) {
      // Pause YouTube player
      if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
        try { ytPlayerRef.current.pauseVideo(); } catch {}
      }
      // Stream radio live via HTML5 Audio
      if (radioAudioRef.current) {
        radioAudioRef.current.src = selectedTrack.streamUrl;
        radioAudioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    } else {
      // Stop radio stream if playing
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
        radioAudioRef.current.removeAttribute('src');
        radioAudioRef.current.load();
      }
      // Stream YouTube video
      if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
        try {
          ytPlayerRef.current.loadVideoById(selectedTrack.id);
          ytPlayerRef.current.playVideo();
        } catch (err) {
          console.warn('Error loading video on select:', err);
        }
      }
    }

    // Trigger silent audio play inside user touch gesture for iOS Lock Screen compliance
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    updateMediaSession(selectedTrack);
  };

  // Play whole playlist and queue it
  const handlePlayPlaylist = (tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks);
    setCurrentIndex(startIndex);
    handleSelectTrack(tracks[startIndex]);
  };

  // Toggle Like Song
  const handleToggleLike = () => {
    const exists = likedTracks.some(t => t.id === currentTrack.id);
    const updated = exists 
      ? likedTracks.filter(t => t.id !== currentTrack.id)
      : [currentTrack, ...likedTracks];
    setLikedTracks(updated);
    localStorage.setItem('jumpin_google_liked', JSON.stringify(updated));
  };

  const handlePlayAll = (tracks, shuffle = false) => {
    if (!tracks || tracks.length === 0) return;
    let list = [...tracks];
    if (shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    handlePlayPlaylist(list, 0);
  };

  // Library Handlers
  const handleOpenPlaylists = () => {
    setSelectedPlaylist({ name: 'Playlists' });
    setPlaylistTracks(CURATED_YOUTUBE_PLAYLISTS);
    setIsPlaylistModalOpen(true);
  };

  const handleOpenArtists = async () => {
    setSelectedPlaylist({ name: 'Artists' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await searchSongs('Bernadya Coldplay Sheila on 7 The Weeknd', googleToken);
      setPlaylistTracks(tracks);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  const handleOpenAlbums = async () => {
    setSelectedPlaylist({ name: 'Albums' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchCategoryTracks('charts');
      setPlaylistTracks(tracks);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  const handleOpenLikedSongs = () => {
    setIsLikedModalOpen(true);
  };

  const handleLoginSuccess = (profile, token, playlists, liked) => {
    setUser(profile);
    setGoogleToken(token);
    if (playlists) setUserPlaylists(playlists);
    if (liked) setLikedTracks(liked);
    setIsAuthOpen(false);
  };

  const isCurrentTrackLiked = likedTracks.some(t => t.id === currentTrack.id);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white antialiased font-sans overflow-hidden select-none">
      {/* 1. Silent HTML5 Audio Element for iOS background keepalive */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
        loop
        playsInline
        preload="auto"
      />

      {/* 2. Direct HTML5 Audio for Live Radio Stations (100% Free, No Login) */}
      <audio
        ref={radioAudioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.warn('Radio stream error:', e)}
      />

      {/* 3. Hidden YouTube Iframe Player Container */}
      <div className="fixed -top-[9999px] -left-[9999px] w-[200px] h-[200px] opacity-0 pointer-events-none overflow-hidden">
        <div id="jumpin-yt-engine"></div>
      </div>

      {/* 4. 1-Second Apple-style Splash Screen (Preserved) */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 5. Active Tab Content View */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'home' && (
          <HomeTab
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onSelectTrack={handleSelectTrack}
            onPlayPlaylist={handlePlayPlaylist}
            queue={queue}
            trendingTracks={trendingTracks}
          />
        )}

        {activeTab === 'new' && (
          <NewTab
            onSelectTrack={handleSelectTrack}
            newTracks={newTracks.length > 0 ? newTracks : trendingTracks}
          />
        )}

        {activeTab === 'radio' && (
          <RadioTab
            onSelectTrack={handleSelectTrack}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === 'library' && (
          <LibraryTab
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPlaylists={handleOpenPlaylists}
            onOpenArtists={handleOpenArtists}
            onOpenAlbums={handleOpenAlbums}
            onOpenLikedSongs={handleOpenLikedSongs}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            onSelectTrack={handleSelectTrack}
            googleToken={googleToken}
          />
        )}
      </main>

      {/* 6. Persistent Mini Player Capsule (Floats above bottom tab bar) */}
      <MiniPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onOpenFullscreen={() => setIsPlayerOpen(true)}
      />

      {/* 7. Apple Music 5-Tab Floating Bottom Navigation Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* 8. Fullscreen Lyrics & Now Playing Modal with Swipe-Down Gesture */}
      <FullscreenPlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        isLiked={isCurrentTrackLiked}
        onToggleLike={handleToggleLike}
        onOpenQueue={() => setIsQueueOpen(true)}
      />

      {/* 9. Queue Modal */}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
      />

      {/* 10. Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        title={selectedPlaylist?.name || 'Playlist'}
        subtitle={loadingPlaylist ? 'Memuat...' : `${playlistTracks.length} lagu`}
        tracks={playlistTracks}
        loading={loadingPlaylist}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPlayTrack={handleSelectTrack}
        onPlayAll={handlePlayAll}
      />

      {/* 11. Liked Songs Modal */}
      <PlaylistModal
        isOpen={isLikedModalOpen}
        onClose={() => setIsLikedModalOpen(false)}
        title="Songs"
        subtitle="Saved & Liked Music"
        tracks={likedTracks}
        isLikedView={true}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPlayTrack={handleSelectTrack}
        onPlayAll={handlePlayAll}
      />

      {/* 12. Google OAuth Sign-in Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
