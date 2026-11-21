import React from 'react';
import { Radio, Play, Volume2 } from 'lucide-react';
import { FAMOUS_RADIO_STATIONS } from '../../services/radioStations';

export default function RadioTab({ onSelectTrack, currentTrackId, isPlaying }) {
  const featuredStations = FAMOUS_RADIO_STATIONS.slice(0, 3);
  const otherStations = FAMOUS_RADIO_STATIONS.slice(3);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Radio' */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Radio</h1>
          <p className="text-xs text-white/50 font-medium mt-0.5">
            Stasiun Radio Terkemuka • Siaran Langsung 24 Jam Bebas Login
          </p>
        </div>
        <div className="p-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <Radio size={20} className="animate-pulse" />
        </div>
      </div>

      {/* Section 1: Featured Top Stations Carousel / Cards */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white tracking-tight mb-3">
          Stasiun Unggulan Indonesia
        </h2>

        <div className="space-y-4">
          {featuredStations.map((station) => {
            const isCurrentStation = currentTrackId === station.id;

            return (
              <div
                key={station.id}
                onClick={() => onSelectTrack(station)}
                className="group relative h-[200px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 active:scale-[0.98] transition-all bg-[#1c1c1e]"
              >
                {/* Background Image with Gradient Overlay */}
                <img
                  src={station.cover}
                  alt={station.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-50"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${station.gradient} opacity-60 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

                {/* Card Content - Guaranteed Visible */}
                <div className="relative z-10 p-5 h-full flex flex-col justify-between pointer-events-none">
                  {/* Top Bar: LIVE Indicator + Frequency Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">
                        LIVE ON AIR
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-black backdrop-blur-md border border-white/20 shadow-md">
                      {station.frequency}
                    </span>
                  </div>

                  {/* Bottom Info: Station Name, City, Tagline + Play Button */}
                  <div className="flex items-end justify-between">
                    <div className="pr-4 pointer-events-auto">
                      <p className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                        {station.city} • {station.category}
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg leading-tight mt-0.5">
                        {station.name}
                      </h3>
                      <p className="text-xs text-white/95 font-semibold line-clamp-1 mt-1 drop-shadow">
                        {station.tagline}
                      </p>
                    </div>

                    {/* Play/Soundwave Button */}
                    <button 
                      type="button"
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-2xl transition-all pointer-events-auto ${
                        isCurrentStation && isPlaying
                          ? 'bg-rose-500 text-white scale-105'
                          : 'bg-white text-black hover:scale-110 active:scale-95'
                      }`}
                    >
                      {isCurrentStation && isPlaying ? (
                        <Volume2 size={22} className="animate-pulse" />
                      ) : (
                        <Play size={20} className="fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: More Famous Stations (List Grid) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white tracking-tight mb-3">
          Stasiun Lainnya
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherStations.map((station) => {
            const isCurrentStation = currentTrackId === station.id;

            return (
              <div
                key={station.id}
                onClick={() => onSelectTrack(station)}
                className={`flex items-center p-3 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] ${
                  isCurrentStation 
                    ? 'bg-white/15 border-rose-500/50' 
                    : 'bg-[#1c1c1e] border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 mr-3 border border-white/10">
                  <img
                    src={station.cover}
                    alt={station.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${station.gradient} opacity-50`} />
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-sm" />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                    {station.frequency}
                  </p>
                  <p className="text-sm font-bold text-white truncate leading-tight mt-0.5">
                    {station.name}
                  </p>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {station.tagline}
                  </p>
                </div>

                <button
                  className={`p-2.5 rounded-full transition shrink-0 ${
                    isCurrentStation && isPlaying
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/10 text-white group-hover:bg-[#007AFF]'
                  }`}
                >
                  <Play size={13} className="fill-current ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
