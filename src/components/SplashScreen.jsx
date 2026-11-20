import React, { useEffect, useState } from 'react';
import JumpInLogo from './JumpInLogo';

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-400 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-rose-600/30 via-red-500/20 to-amber-500/10 blur-3xl animate-pulse-subtle" />

      {/* Center Branding */}
      <div className="relative flex flex-col items-center space-y-4">
        {/* Modern Apple-style Icon with Musical Note 'J' */}
        <div className="relative w-22 h-22 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-2xl backdrop-blur-2xl flex items-center justify-center p-3">
          <JumpInLogo size={46} />
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

      {/* Bottom Center Credits: Fajar Umarsandi */}
      <div className="absolute bottom-8 flex flex-col items-center space-y-2.5">
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:0.4s]"></div>
        </div>
        <p className="text-[11px] font-medium tracking-widest text-white/50 uppercase">
          Fajar Umarsandi
        </p>
      </div>
    </div>
  );
}
