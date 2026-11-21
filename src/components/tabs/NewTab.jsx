import React from 'react';
import { ChevronRight, Play } from 'lucide-react';

export default function NewTab({ onSelectTrack, onPlayPlaylist, newTracks = [] }) {
  const featuredBanners = [
    {
      id: 'best_2026',
      badge: 'BEST OF 2026',
      title: 'Best Songs of 2026',
      subtitle: 'JumpIn Music',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      description: 'The tracks that made our year.'
    },
    {
      id: 'viral_hits',
      badge: 'NEW PLAYLIST',
      title: 'Viral Hits Indonesia',
      subtitle: 'TikTok & Spotify Top 50',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      description: 'Trending and viral across social media.'
    }
  ];

  const handleBannerClick = () => {
    if (onPlayPlaylist && newTracks.length > 0) {
      onPlayPlaylist(newTracks, 0);
    } else if (newTracks.length > 0) {
      onSelectTrack(newTracks[0]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'New' */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tight">New</h1>
        <p className="text-xs text-white/50 font-medium mt-0.5">
          Rilis Baru & Lagu Terkini 2026
        </p>
      </div>

      {/* Featured Wide Banners */}
      <div className="mt-6 flex space-x-4 overflow-x-auto no-scrollbar pb-2">
        {featuredBanners.map((banner) => (
          <div
            key={banner.id}
            onClick={handleBannerClick}
            className="w-[280px] sm:w-[320px] shrink-0 cursor-pointer active:scale-[0.98] transition-all group"
          >
            <p className="text-[11px] font-bold text-white/50 tracking-wider uppercase">
              {banner.badge}
            </p>
            <h3 className="text-xl font-bold text-white truncate leading-tight">
              {banner.title}
            </h3>
            <p className="text-xs text-white/50 truncate mb-2.5">
              {banner.subtitle}
            </p>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-[#1c1c1e]">
              <img
                src={banner.cover}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <p className="text-xs font-semibold text-white/90">
                  {banner.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 1: Our Favourite Albums of the Year > */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center group cursor-pointer">
            <span>Our Favourite Albums of the Year</span>
            <ChevronRight size={20} className="text-white/40 ml-1 group-hover:text-white transition" />
          </h2>
        </div>

        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pb-2">
          {newTracks.slice(0, 8).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => {
                if (onPlayPlaylist) {
                  onPlayPlaylist(newTracks, idx);
                } else {
                  onSelectTrack(item);
                }
              }}
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

      {/* Section 2: Latest New Single Releases */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white tracking-tight mb-3">
          Latest Releases
        </h2>
        <div className="space-y-2">
          {newTracks.slice(0, 10).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectTrack(item)}
              className="flex items-center p-2 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shadow mr-3 shrink-0 group-hover:scale-105 transition"
              />
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold truncate text-white">{item.title}</p>
                <p className="text-xs text-white/55 truncate mt-0.5">{item.artist}</p>
              </div>
              <button className="p-2 rounded-full bg-white/10 text-white/80 group-hover:bg-[#007AFF] group-hover:text-white transition shrink-0">
                <Play size={13} className="fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
