import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function HomeTab({
  user,
  onOpenAuth,
  onSelectTrack,
  queue,
  trendingTracks = []
}) {
  const userName = user?.name || 'Fajar Umarsandi';
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'FU';
  const userAvatar = user?.avatar;

  const topPicks = [
    {
      id: 'pick_1',
      title: 'New Music',
      subtitle: 'Made for You',
      description: 'Bernadya, The Weeknd, Jaz, Hindia, and more',
      bgGradient: 'from-[#FF2D55] via-[#FF375F] to-[#FC3D39]',
      query: 'top hits indonesia 2026'
    },
    {
      id: 'pick_2',
      title: 'Chill Vibes',
      subtitle: 'Santai Sore',
      description: 'Akustik, Pop Santai, Lofi & Afternoon Beats',
      bgGradient: 'from-[#5856D6] via-[#AF52DE] to-[#FF2D55]',
      query: 'lagu santai sore akustik indonesia'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Home' + Profile Icon */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tight">Home</h1>
        <button
          onClick={onOpenAuth}
          className="w-9 h-9 rounded-full bg-[#5856D6] text-white font-bold text-xs flex items-center justify-center border border-white/10 shadow-md active:scale-95 transition overflow-hidden"
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
          {topPicks.map((pick) => (
            <div
              key={pick.id}
              onClick={() => {
                if (trendingTracks.length > 0) onSelectTrack(trendingTracks[0]);
              }}
              className={`w-[260px] sm:w-[280px] h-[340px] shrink-0 rounded-3xl p-6 bg-gradient-to-br ${pick.bgGradient} flex flex-col justify-between shadow-2xl shadow-rose-900/30 cursor-pointer active:scale-[0.98] transition-all group relative overflow-hidden`}
            >
              {/* Apple Music Logo Tag in Top Right */}
              <div className="flex justify-end items-center">
                <span className="text-[11px] font-bold text-white/90 tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-md">
                  JumpIn
                </span>
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
                <p className="text-xs text-white/95 font-medium line-clamp-2 mt-0.5">
                  {pick.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Recently Played > */}
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

      {/* Section 3: Trending Now */}
      {trendingTracks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white tracking-tight mb-3">
            Trending Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {trendingTracks.slice(0, 6).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectTrack(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/10 active:scale-[0.98] transition-all bg-[#1a1a1e]"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-2 inset-x-2.5">
                  <p className="text-xs font-bold text-white truncate drop-shadow">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-white/70 truncate mt-0.5">
                    {item.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
