import React from 'react';
import { Radio, Play, Sparkles } from 'lucide-react';

export default function RadioTab({ onSelectTrack, radioTracks = [] }) {
  const stations = [
    {
      id: 'jumpin_1',
      name: 'JumpIn 1',
      tagline: 'Always live. The world\'s best new music.',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#007AFF] via-[#5856D6] to-[#AF52DE]'
    },
    {
      id: 'indo_hits_radio',
      name: 'Indonesian Hits Radio',
      tagline: 'Lagu pop terbaik Indonesia 24 jam non-stop.',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#FF2D55] via-[#FF375F] to-[#FF9500]'
    },
    {
      id: 'chill_lofi_radio',
      name: 'Lofi Chill Radio',
      tagline: 'Beats to relax, study, and vibe to.',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#34C759] via-[#30B0C7] to-[#007AFF]'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Radio' */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tight">Radio</h1>
      </div>

      {/* Featured Stations */}
      <div className="mt-6 space-y-4">
        {stations.map((st) => (
          <div
            key={st.id}
            onClick={() => {
              if (radioTracks.length > 0) onSelectTrack(radioTracks[0]);
            }}
            className="group relative h-[180px] rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/10 active:scale-[0.98] transition-all"
          >
            <img
              src={st.cover}
              alt={st.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${st.gradient} opacity-80 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md w-fit">
                <Radio size={13} className="text-white animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Live Station
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white drop-shadow-md">
                  {st.name}
                </h3>
                <p className="text-xs text-white/85 font-medium mt-1">
                  {st.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instant Radio Playlist Songs */}
      {radioTracks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white tracking-tight mb-3">
            On Air Tracks
          </h2>
          <div className="space-y-2">
            {radioTracks.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectTrack(item)}
                className="flex items-center p-2 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-12 h-12 rounded-xl object-cover shadow mr-3 shrink-0"
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
      )}
    </div>
  );
}
