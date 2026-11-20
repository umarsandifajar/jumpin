import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../services/supabaseClient';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
        onClose();
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/15 p-6 text-white shadow-2xl z-10 animate-slide-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Center Branding */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 mb-4">
            <Sparkles size={28} className="text-white" />
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight">JumpIn Cloud</h3>
          <p className="text-xs text-white/60 mt-1.5 max-w-[240px]">
            Sync your liked music and playlists across iPhone and all your devices.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5 my-6 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/80">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
            <span>Instant sync with your iPhone PWA</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
            <span>Unlimited Liked Songs & Playlists</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
            <span>No ads, pure background playback</span>
          </div>
        </div>

        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition shadow-lg"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin text-black" />
          ) : (
            <>
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-white/40 text-center mt-4">
          By continuing, you agree to JumpIn's seamless music experience.
        </p>
      </div>
    </div>
  );
}
