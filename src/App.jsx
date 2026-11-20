import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import NowPlaying from './components/NowPlaying';
import SearchModal from './components/SearchModal';
import QueueModal from './components/QueueModal';
import SidebarDrawer from './components/SidebarDrawer';
import AuthModal from './components/AuthModal';
import PlaylistModal from './components/PlaylistModal';
import { 
  INITIAL_TRACKS, 
  getAudioStreamUrl, 
  CURATED_YOUTUBE_PLAYLISTS, 
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
  const [queue, setQueue] = useState(INITIAL_TRACKS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Google & YouTube Music State
  const [user, setUser] = useState(null);
  const [googleToken, setGoogleToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Playlist View State
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const currentTrack = queue[currentIndex] || INITIAL_TRACKS[0];

  // Restore Google Session on mount
  useEffect(() => {
    const session = getSavedSession();
    if (session && session.profile) {
      setUser(session.profile);
      setGoogleToken(session.token);
      if (session.playlists) setUserPlaylists(session.playlists);
      if (session.liked) setLikedTracks(session.liked);
    }
  }, []);

  // Initialize YouTube Iframe Player Engine (Instant direct stream, no 403, no proxy lag)
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
              event.target.setVolume(volume * 100);
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

  // Sync track changes with YouTube Engine & MediaSession
  useEffect(() => {
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
    updateMediaSession(currentTrack);
  }, [currentIndex, currentTrack.id]);

  // Smooth Scrubber Interval from YouTube Player Engine
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
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
  }, [isPlaying]);

  // iOS Lock Screen & Dynamic Island MediaSession Integration
  const updateMediaSession = (track) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'JumpIn',
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

    if (ytPlayerRef.current && ytPlayerRef.current.playVideo) {
      ytPlayerRef.current.playVideo();
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';

    if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
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
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      handleSeek(0);
    } else {
      const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIdx);
      setCurrentTime(0);
    }
  };

  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (err) {
        console.warn('Seek error:', err);
      }
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setIsMuted(false);
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      ytPlayerRef.current.setVolume(newVol * 100);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
        ytPlayerRef.current.setVolume(volume * 100);
      }
    } else {
      setIsMuted(true);
      if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
        ytPlayerRef.current.setVolume(0);
      }
    }
  };

  const handleSelectTrack = (selectedTrack) => {
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

    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        ytPlayerRef.current.loadVideoById(selectedTrack.id);
        ytPlayerRef.current.playVideo();
      } catch (err) {
        console.warn('Error loading video on select:', err);
      }
    }

    // Trigger silent audio play inside user touch gesture for iOS Lock Screen compliance
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Toggle Like Song (Saved to Local/Google Cache)
  const handleToggleLike = () => {
    const exists = likedTracks.some(t => t.id === currentTrack.id);
    const updated = exists 
      ? likedTracks.filter(t => t.id !== currentTrack.id)
      : [currentTrack, ...likedTracks];
    setLikedTracks(updated);
    localStorage.setItem('jumpin_google_liked', JSON.stringify(updated));
  };

  // Play whole playlist (with optional shuffle)
  const handlePlayAll = (tracks, shuffle = false) => {
    if (!tracks || tracks.length === 0) return;
    let list = [...tracks];
    if (shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    setQueue(list);
    setCurrentIndex(0);
    setIsPlaying(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = list[0].audioUrl;
      audioRef.current.play().catch(console.warn);
    }
  };

  // Open Beranda (Home)
  const handleOpenBeranda = async () => {
    setSelectedPlaylist({ name: 'Beranda YouTube (Pilihan Terpopuler)' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchCategoryTracks('beranda');
      setPlaylistTracks(tracks);
    } catch (err) {
      console.error('Fetch beranda error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Open New Releases
  const handleOpenNew = async () => {
    setSelectedPlaylist({ name: 'Rilis Baru di YouTube Music' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchCategoryTracks('new');
      setPlaylistTracks(tracks);
    } catch (err) {
      console.error('Fetch new releases error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Open Albums & Charts
  const handleOpenAlbums = async () => {
    setSelectedPlaylist({ name: 'Album & Tangga Lagu Terpopuler' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchCategoryTracks('charts');
      setPlaylistTracks(tracks);
    } catch (err) {
      console.error('Fetch albums/charts error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Open YouTube Trending / Explore Music
  const handleOpenTrending = async () => {
    setSelectedPlaylist({ name: 'Trending di YouTube' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchTrendingMusic(googleToken);
      setPlaylistTracks(tracks);
    } catch (err) {
      console.error('Fetch trending music error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Open a specific user or curated YouTube playlist
  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);

    try {
      if (playlist.query) {
        const tracks = await searchSongs(playlist.query, googleToken);
        setPlaylistTracks(tracks);
      } else {
        const tracks = await fetchPlaylistTracks(googleToken, playlist.id);
        setPlaylistTracks(tracks);
      }
    } catch (err) {
      console.error('Fetch playlist items error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Open Subscribed Artists
  const handleOpenArtists = async () => {
    setSelectedPlaylist({ name: 'Artis & Musisi Pilihan' });
    setIsPlaylistModalOpen(true);
    setLoadingPlaylist(true);
    try {
      let tracks = [];
      if (googleToken) {
        const artists = await fetchSubscribedArtists(googleToken);
        if (artists && artists.length > 0) {
          tracks = await searchSongs(artists[0].name + ' best songs', googleToken);
        }
      }
      if (tracks.length === 0) {
        tracks = await searchSongs('Bernadya Mahalini Juicy Luicy Hindia Coldplay', googleToken);
      }
      setPlaylistTracks(tracks);
    } catch (err) {
      console.error('Fetch artists error:', err);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // Handle Google OAuth Login Success
  const handleLoginSuccess = ({ profile, playlists, likedTracks: importedLiked, accessToken }) => {
    setUser(profile);
    setGoogleToken(accessToken);
    if (playlists) setUserPlaylists(playlists);
    if (importedLiked && importedLiked.length > 0) setLikedTracks(importedLiked);
  };

  const handleSignOut = () => {
    logoutGoogle();
    setUser(null);
    setGoogleToken(null);
    setUserPlaylists([]);
    setLikedTracks([]);
  };

  const isCurrentTrackLiked = likedTracks.some(t => t.id === currentTrack.id);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Silent HTML5 Audio Element for iOS background audio compliance */}
      <audio 
        ref={audioRef} 
        playsInline 
        loop 
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" 
      />

      {/* Hidden YouTube Engine for direct audio streaming without 403 or server timeouts */}
      <div className="fixed -top-[9999px] -left-[9999px] w-[200px] h-[200px] opacity-0 pointer-events-none overflow-hidden z-[-1]">
        <div id="jumpin-yt-engine"></div>
      </div>

      {/* 1-Second Apple-style Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Main Fullscreen Player */}
      <NowPlaying
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isLiked={isCurrentTrackLiked}
        onToggleLike={handleToggleLike}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Navigation Library Drawer with Real User Playlists */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBeranda={handleOpenBeranda}
        onOpenNew={handleOpenNew}
        onOpenTrending={handleOpenTrending}
        onOpenAlbums={handleOpenAlbums}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenLikedMusic={() => setIsLikedModalOpen(true)}
        onOpenArtists={handleOpenArtists}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectPlaylist={handleSelectPlaylist}
        playlists={userPlaylists}
        curatedPlaylists={CURATED_YOUTUBE_PLAYLISTS}
        user={user}
        onSignOut={handleSignOut}
        likedTracksCount={likedTracks.length}
      />

      {/* Search Modal with Google Token */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTrack={handleSelectTrack}
        googleToken={googleToken}
      />

      {/* Playing Queue Modal */}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
      />

      {/* Liked Songs Playlist Modal */}
      <PlaylistModal
        isOpen={isLikedModalOpen}
        onClose={() => setIsLikedModalOpen(false)}
        title="Liked Music"
        subtitle="Imported from YouTube Music"
        tracks={likedTracks}
        isLikedView={true}
        currentTrackId={currentTrack.id}
        isPlaying={isPlaying}
        onPlayTrack={handleSelectTrack}
        onPlayAll={handlePlayAll}
      />

      {/* Selected YouTube Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        title={selectedPlaylist?.name || "YouTube Playlist"}
        subtitle={loadingPlaylist ? "Memuat lagu..." : `${playlistTracks.length} songs from YouTube`}
        tracks={playlistTracks}
        loading={loadingPlaylist}
        isLikedView={false}
        currentTrackId={currentTrack.id}
        isPlaying={isPlaying}
        onPlayTrack={handleSelectTrack}
        onPlayAll={handlePlayAll}
      />

      {/* Real Google OAuth Sign-in Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
