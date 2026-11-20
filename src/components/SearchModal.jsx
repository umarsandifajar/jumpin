import React, { useState } from 'react';
import { Search, X, Music, Play, Loader2 } from 'lucide-react';
import { searchSongs } from '../services/pipedApi';

export default function SearchModal({ isOpen, onClose, onSelectTrack, googleToken }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchSongs(query, googleToken);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-5">
      {/* Search Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-tight text-white">Search Music</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mt-4">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists on YouTube..."
            autoFocus
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500/50 text-sm font-medium"
          />
          <button
            type="submit"
            className="absolute right-2 px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 active:scale-95 transition"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 pb-10">
        {results.length === 0 && !loading && (
          <div className="text-center py-20 text-white/40 text-sm">
            <Music size={40} className="mx-auto mb-3 opacity-30" />
            <p>Type any song name, artist or band</p>
            <p className="text-xs text-white/30 mt-1">Direct stream without ads</p>
          </div>
        )}

        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onSelectTrack(item);
              onClose();
            }}
            className="flex items-center p-2.5 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group"
          >
            <img
              src={item.cover}
              alt={item.title}
              className="w-12 h-12 rounded-xl object-cover shadow-md mr-3.5 group-hover:scale-105 transition"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{item.title}</p>
              <p className="text-xs text-white/60 truncate mt-0.5">{item.artist}</p>
            </div>
            <button className="p-2 rounded-full bg-white/10 text-white/80 group-hover:bg-rose-500 group-hover:text-white transition">
              <Play size={14} className="fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
