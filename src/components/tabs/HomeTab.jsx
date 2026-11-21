import React from 'react';
import { ChevronRight, Play, Sparkles, Flame, Coffee } from 'lucide-react';
import { 
  NEW_MUSIC_TRACKS, 
  CHILL_MUSIC_TRACKS, 
  TRENDING_TRACKS 
} from '../../services/pipedApi';

export default function HomeTab({
  user,
  onOpenAuth,
  onSelectTrack,
  onPlayPlaylist,
  queue,
  trendingTracks = []
}) {
  const userName = user?.name || 'Fajar Umarsandi';
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'FU';
  const userAvatar = user?.avatar;

  const actualTrending = trendingTracks.length > 0 ? trendingTracks : TRENDING_TRACKS;

  const topPicks = [
    {
      id: 'pick_new',
      title: 'New Music',
      subtitle: 'Rilisan Baru 2026',
      badge: 'Rilis Baru',
      icon: Sparkles,
      description: 'Bernadya, Sal Priadi, Billie Eilish, Sabrina Carpenter, Hindia, NIKI',
      bgGradient: 'from-[#FF2D55] via-[#FF375F] to-[#FC3D39]',
      tracks: NEW_MUSIC_TRACKS
    },
    {
      id: 'pick_chill',
      title: 'Chill Vibes',
      subtitle: 'Santai Sore & Akustik',
      badge: 'Santai',
      icon: Coffee,
      description: 'Nadin Amizah, Tulus, Pamungkas, Ardhito Pramono, Feby Putri, Lofi',
      bgGradient: 'from-[#5856D6] via-[#AF52DE] to-[#FF2D55]',
      tracks: CHILL_MUSIC_TRACKS
    },
    {
      id: 'pick_trending',
      title: 'Top Hits Indo',
      subtitle: 'Paling Banyak Diputar',
      badge: 'Trending',
      icon: Flame,
      description: 'Denny Caknan, Juicy Luicy, Mahalini, Tiara Andini, Bruno Mars',
      bgGradient: 'from-[#007AFF] via-[#5856D6] to-[#AF52DE]',
      tracks: actualTrending
    }
  ];

  const handlePickClick = (pick) => {
    if (onPlayPlaylist && pick.tracks.length > 0) {
      onPlayPlaylist(pick.tracks, 0);
    } else if (pick.tracks.length > 0) {
      onSelectTrack(pick.tracks[0]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Home' + Profile Icon */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Home</h1>
          <p className="text-xs text-white/50 font-medium mt-0.5">
            Selamat Datang, {userName}
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5856D6] to-[#AF52DE] text-white font-bold text-xs flex items-center justify-center border border-white/10 shadow-md active:scale-95 transition overflow-hidden"
          title={user ? user.name : 'Login Google'}
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{userInitials}</span>
          )}
        </button>
      </div>

      {/* Section 1: Top Picks for You */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white tracking-tight mb-3">
          Top Picks for You
        </h2>
        
        {/* Horizontal Carousel of Featured Hero Cards */}
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-2">
          {topPicks.map((pick) => {
            const Icon = pick.icon;

            return (
              <div
                key={pick.id}
                onClick={() => handlePickClick(pick)}
                className={`w-[260px] sm:w-[280px] h-[340px] shrink-0 rounded-3xl p-6 bg-gradient-to-br ${pick.bgGradient} flex flex-col justify-between shadow-2xl shadow-rose-900/30 cursor-pointer active:scale-[0.98] transition-all group relative overflow-hidden`}
              >
                {/* Top Badge: JumpIn Tag + Category Icon */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center space-x-1">
                    <Icon size={12} className="text-amber-300" />
                    <span>{pick.badge}</span>
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow">
                    <Play size={16} className="fill-current ml-0.5" />
                  </div>
                </div>

                {/* Card Center Titles */}
                <div className="my-auto">
                  <h3 className="text-4xl font-black text-white leading-tight drop-shadow-md group-hover:scale-105 transition-transform">
                    {pick.title}
                  </h3>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-auto">
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                    {pick.subtitle}
                  </p>
                  <p className="text-xs text-white/95 font-medium line-clamp-2 mt-1">
                    {pick.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Recently Played */}
      {queue && queue.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center group cursor-pointer">
              <span>Recently Played</span>
              <ChevronRight size={20} className="text-white/40 ml-1 group-hover:text-white transition" />
            </h2>
          </div>

          <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-2">
            {queue.slice(0, 8).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectTrack(item)}
                className="w-36 shrink-0 cursor-pointer group active:scale-95 transition-all"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-[#1c1c1e]">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2 rounded-full bg-white/90 text-black">
                      <Play size={14} className="fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold text-white truncate mt-2 leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-white/50 truncate mt-0.5">
                  {item.artist}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Trending Now (Real YouTube Trending Songs) */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-1.5">
            <Flame size={20} className="text-rose-500 fill-rose-500" />
            <span>Trending YouTube Saat Ini</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actualTrending.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTrack(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 active:scale-[0.98] transition-all bg-[#1a1a1e] shadow-lg"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              
              {/* Play Badge */}
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={12} className="fill-white ml-0.5" />
              </div>

              {/* Title & Artist */}
              <div className="absolute bottom-2.5 inset-x-2.5">
                <p className="text-xs font-bold text-white truncate leading-tight drop-shadow">
                  {item.title}
                </p>
                <p className="text-[10px] text-white/70 truncate mt-0.5 font-medium">
                  {item.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
