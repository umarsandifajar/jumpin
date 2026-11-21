import React, { useState } from 'react';
import { Search, Mic, X, Play, Loader2 } from 'lucide-react';
import { searchSongs } from '../../services/pipedApi';

export default function SearchTab({ onSelectTrack, googleToken }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: 'radio',
      title: 'JumpIn Radio',
      color: 'bg-gradient-to-br from-[#FF2D55] to-[#E02447]',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      query: 'top radio hits 2026'
    },
    {
      id: 'dance',
      title: 'Dance/Electronic',
      color: 'bg-gradient-to-br from-[#30D158] to-[#248A3D]',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      query: 'dance electronic club hits'
    },
    {
      id: 'indonesian',
      title: 'Indonesian Music',
      color: 'bg-gradient-to-br from-[#007AFF] to-[#0051A8]',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      query: 'top songs indonesia viral 2026'
    },
    {
      id: 'pop',
      title: 'Pop',
      color: 'bg-gradient-to-br from-[#FF375F] to-[#D92B4E]',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80',
      query: 'today top hits pop'
    },
    {
      id: 'kpop',
      title: 'K-Pop',
      color: 'bg-gradient-to-br from-[#FF2D55] to-[#AF52DE]',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
      query: 'kpop top hits newjeans bts blackpink'
    },
    {
      id: 'alternative',
      title: 'Alternative',
      color: 'bg-gradient-to-br from-[#D1C438] to-[#A39620]',
      image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&auto=format&fit=crop&q=80',
      query: 'indie alternative rock hits'
    },
    {
      id: 'rock',
      title: 'Rock',
      color: 'bg-gradient-to-br from-[#FF9500] to-[#C93400]',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
      query: 'classic rock modern rock hits'
    },
    {
      id: 'rnb',
      title: 'R&B',
      color: 'bg-gradient-to-br from-[#AF52DE] to-[#682390]',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      query: 'rnb soul smooth hits'
    },
    {
      id: 'hiphop',
      title: 'Hip-Hop/Rap',
      color: 'bg-gradient-to-br from-[#5AC8FA] to-[#147EFB]',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
      query: 'hip hop rap top charts'
    },
    {
      id: 'gaming',
      title: 'Gaming & Lofi',
      color: 'bg-gradient-to-br from-[#5856D6] to-[#3634A3]',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80',
      query: 'gaming synthwave lofi beats'
    }
  ];

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchSongs(searchTerm, googleToken);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setQuery(cat.title);
    handleSearch(cat.query);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pt-12 pb-36 select-none max-w-2xl mx-auto w-full">
      {/* Header: Large Bold 'Search' (Matches Screenshot 2) */}
      <div className="pb-3 border-b border-white/5">
        <h1 className="text-3xl font-black text-white tracking-tight">Search</h1>
      </div>

      {/* Search Input Field */}
      <div className="mt-4 relative flex items-center">
        <Search size={18} className="absolute left-4 text-white/40 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) setResults([]);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(query);
          }}
          placeholder="Artists, Songs, Lyrics & More"
          className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#1c1c1e] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#007AFF]/60 text-sm font-medium transition shadow-inner"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3.5 p-1 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X size={14} />
          </button>
        ) : (
          <Mic size={18} className="absolute right-4 text-white/40 pointer-events-none" />
        )}
      </div>

      {/* State A: Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/60">
          <Loader2 size={36} className="animate-spin text-[#007AFF] mb-3" />
          <p className="text-sm font-medium">Searching JumpIn & YouTube...</p>
        </div>
      )}

      {/* State B: Search Results List */}
      {!loading && results.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
            Top Results ({results.length})
          </p>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTrack(item)}
              className="flex items-center p-2.5 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shadow-md mr-3.5 group-hover:scale-105 transition shrink-0"
              />
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold truncate text-white leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-white/55 truncate mt-0.5 font-medium">
                  {item.artist}
                </p>
              </div>
              <button className="p-2.5 rounded-full bg-white/10 text-white/80 group-hover:bg-[#007AFF] group-hover:text-white transition shrink-0">
                <Play size={13} className="fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* State C: 2-Column Colorful Apple Music Genre Grid (Matches Screenshot 2) */}
      {!loading && results.length === 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`${cat.color} h-28 rounded-2xl p-3.5 relative overflow-hidden shadow-md cursor-pointer active:scale-95 transition-all group flex flex-col justify-between`}
              >
                {/* Genre Title */}
                <h3 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-sm max-w-[65%] z-10">
                  {cat.title}
                </h3>

                {/* Right Image Cutout like Screenshot 2 */}
                <div className="absolute -right-2 -bottom-2 w-20 h-24 rounded-xl overflow-hidden shadow-lg transform rotate-6 group-hover:scale-105 group-hover:rotate-3 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
