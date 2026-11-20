import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Music, 
  Play, 
  Loader2, 
  LayoutGrid, 
  List, 
  Flame, 
  Sparkles 
} from 'lucide-react';
import { searchSongs } from '../services/pipedApi';

const SUGGESTED_CHIPS = [
  'Top Hits 2025',
  'Bernadya',
  'Mahalini',
  'Sheila on 7',
  'Coldplay',
  'Sal Priadi',
  'Lofi Chill',
  'The Weeknd'
];

export default function SearchModal({ isOpen, onClose, onSelectTrack, googleToken }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Instagram style) or 'list'

  if (!isOpen) return null;

  const triggerSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
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

  const handleSearch = (e) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const handleChipClick = (term) => {
    setQuery(term);
    triggerSearch(term);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-4 sm:px-6 text-white">
      {/* Search Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md">
            <Search size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">Cari Lagu & Artis</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle when results exist */}
          {results.length > 0 && (
            <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Tampilan Kotak Instagram"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Tampilan Daftar"
              >
                <List size={14} />
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white active:scale-95 transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mt-3.5 shrink-0">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik judul lagu, penyanyi atau band..."
            autoFocus
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-rose-500/60 text-sm font-medium transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition shadow-md shadow-rose-500/30 flex items-center space-x-1"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <span>Cari</span>}
          </button>
        </div>
      </form>

      {/* Quick Trend Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-3 shrink-0">
        <span className="text-[11px] font-semibold text-rose-400 shrink-0 flex items-center space-x-1 pl-1">
          <Flame size={12} />
          <span>Tren:</span>
        </span>
        {SUGGESTED_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition text-xs font-medium text-white/80 hover:text-white shrink-0 border border-white/5"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Results Container (Ultra-Sleek Scrollbar) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-12 pt-1 select-none">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-white/60">
            <Loader2 size={36} className="animate-spin text-rose-500 mb-3" />
            <p className="text-sm font-medium">Mencari di YouTube...</p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-20 text-white/40 text-sm">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Music size={30} className="opacity-40 text-rose-500" />
            </div>
            <p className="font-semibold text-white/70">Ketik lagu atau pilih tren di atas</p>
            <p className="text-xs text-white/40 mt-1">Streaming audio langsung dari YouTube tanpa iklan</p>
          </div>
        )}

        {!loading && results.length > 0 && viewMode === 'grid' && (
          /* ========================================================== */
          /* INSTAGRAM EXPLORE GRID VIEW FOR SEARCH RESULTS             */
          /* ========================================================== */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {results.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => {
                  onSelectTrack(item);
                  onClose();
                }}
                className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-rose-500/60 transition-all duration-300 active:scale-[0.97] bg-[#1a1a1e] hover:shadow-xl hover:shadow-black/60"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Top Duration Badge */}
                {item.duration && (
                  <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-black/60 text-white/80 backdrop-blur-md border border-white/10">
                      {item.duration}
                    </span>
                  </div>
                )}

                {/* Bottom Shadow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-45% to-transparent pointer-events-none" />

                {/* Center Play Button Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 transform group-hover:scale-105 active:scale-95 transition backdrop-blur-md">
                    <Play size={18} className="fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Artist */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                  <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-white/70 truncate mt-0.5 drop-shadow">
                    {item.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && viewMode === 'list' && (
          /* ========================================================== */
          /* CLASSIC LIST VIEW                                          */
          /* ========================================================== */
          <div className="space-y-1.5">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectTrack(item);
                  onClose();
                }}
                className="flex items-center p-2.5 rounded-2xl hover:bg-white/10 active:bg-white/15 transition cursor-pointer group border border-transparent hover:border-white/10"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-12 h-12 rounded-xl object-cover shadow-md mr-3.5 group-hover:scale-105 transition shrink-0"
                />
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                  <p className="text-xs text-white/60 truncate mt-0.5">{item.artist}</p>
                </div>
                {item.duration && (
                  <span className="text-xs text-white/40 mr-2 shrink-0 font-mono">
                    {item.duration}
                  </span>
                )}
                <button className="p-2 rounded-full bg-white/10 text-white/80 group-hover:bg-rose-500 group-hover:text-white transition shrink-0">
                  <Play size={13} className="fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
