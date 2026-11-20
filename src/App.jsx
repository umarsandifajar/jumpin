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

  // Initialize Audio element and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.currentTime > 0) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => handleNext();
    const handleOnPlay = () => {
      setIsPlaying(true);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    };
    const handleOnPause = () => {
      setIsPlaying(false);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handleOnPlay);
    audio.addEventListener('pause', handleOnPause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handleOnPlay);
      audio.removeEventListener('pause', handleOnPause);
    };
  }, [currentIndex, queue]);

  // Load stream / audio URL whenever current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const loadTrack = async () => {
      let src = currentTrack.audioUrl;

      // If YouTube stream track, resolve stream URL from local proxy
      if (currentTrack.isStream && !src) {
        src = await getAudioStreamUrl(currentTrack.id);
      }

      if (src) {
        audio.src = src;
        audio.volume = isMuted ? 0 : volume;
        if (isPlaying) {
          audio.play().catch(console.warn);
        }
      }
    };

    loadTrack();
    updateMediaSession(currentTrack);
  }, [currentIndex, currentTrack.id]);

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
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';

    if (audioRef.current) {
      if (!audioRef.current.src || !audioRef.current.src.includes(currentTrack.id)) {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.play().catch((err) => {
        console.warn('Playback error or gesture needed:', err);
      });
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
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
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIdx);
    }
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
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
    if (audioRef.current) {
      audioRef.current.src = selectedTrack.audioUrl;
      audioRef.current.play().catch((err) => {
        console.warn('Playback waiting for user gesture or stream buffering:', err);
      });
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
      {/* Hidden HTML5 Audio Element for iOS background audio compliance */}
      <audio ref={audioRef} playsInline preload="auto" />

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
