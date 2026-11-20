import React from 'react';
import { X, Play, Music2 } from 'lucide-react';

export default function QueueModal({ isOpen, onClose, queue, currentTrack, onSelectTrack }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl flex flex-col animate-fade-in safe-top safe-bottom px-5">
      <div className="flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Music2 size={20} className="text-rose-500" />
          <h2 className="text-xl font-bold tracking-tight text-white">Playing Queue</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar mt-4 space-y-2 pb-10 select-none">
        {queue.map((item, index) => {
          const isCurrent = currentTrack.id === item.id;
          return (
            <div
              key={`${item.id}-${index}`}
              onClick={() => {
                onSelectTrack(item);
                onClose();
              }}
              className={`flex items-center p-2.5 rounded-2xl transition cursor-pointer ${
                isCurrent ? 'bg-white/15 border border-white/20' : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-bold text-white/40 w-6 text-center mr-2">
                {index + 1}
              </span>
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 rounded-xl object-cover shadow mr-3"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-white'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-white/60 truncate mt-0.5">{item.artist}</p>
              </div>
              {isCurrent ? (
                <div className="flex items-end space-x-1 h-4 mr-2">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce"></span>
                  <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                  <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                </div>
              ) : (
                <button className="p-2 rounded-full text-white/50 hover:text-white">
                  <Play size={14} className="fill-current" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
