import React from 'react';

export default function MiniVisualizer({ isPlaying }) {
  return (
    <div 
      className="flex items-end justify-center space-x-[2.5px] px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 h-7"
      title={isPlaying ? "Playing audio" : "Paused"}
    >
      <span 
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-rose-500 to-rose-300 transition-all duration-300 ${
          isPlaying ? 'h-4 animate-bounce [animation-delay:-0.3s]' : 'h-1.5 opacity-40'
        }`}
      />
      <span 
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-rose-500 to-white transition-all duration-300 ${
          isPlaying ? 'h-5 animate-bounce [animation-delay:-0.15s]' : 'h-2 opacity-50'
        }`}
      />
      <span 
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-rose-500 to-rose-300 transition-all duration-300 ${
          isPlaying ? 'h-3 animate-bounce [animation-delay:-0.4s]' : 'h-1.5 opacity-40'
        }`}
      />
      <span 
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-rose-500 to-white transition-all duration-300 ${
          isPlaying ? 'h-4.5 animate-bounce [animation-delay:-0.25s]' : 'h-1.5 opacity-40'
        }`}
      />
    </div>
  );
}
