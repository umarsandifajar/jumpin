import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1000ms, then trigger fade out
    const timer = setTimeout(() => {
      setFading(true);
    }, 1000);

    // After fade-out transition completes (400ms), finish
    const exitTimer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-400 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-600/30 via-red-500/20 to-amber-500/10 blur-3xl animate-pulse-subtle" />

      {/* Center Branding */}
      <div className="relative flex flex-col items-center space-y-4">
        {/* Modern Apple-style Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-2xl backdrop-blur-2xl flex items-center justify-center">
          <div className="flex items-end space-x-1.5 h-8">
            <span className="w-1.5 h-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-8 bg-gradient-to-t from-rose-500 to-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-6 bg-white rounded-full animate-bounce"></span>
            <span className="w-1.5 h-4 bg-white/70 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Jump<span className="text-rose-500">In</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-white/40 mt-1 font-medium">
            Pure Music
          </p>
        </div>
      </div>

      {/* Subtle bottom indicator */}
      <div className="absolute bottom-10 flex items-center space-x-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
}
