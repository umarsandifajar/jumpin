import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage keys
const LOCAL_USER_KEY = 'jumpin_local_user';
const LOCAL_LIKED_KEY = 'jumpin_local_liked';
const LOCAL_PLAYLISTS_KEY = 'jumpin_local_playlists';

// Get Current User (Supabase or Local)
export async function getCurrentUser() {
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  const local = localStorage.getItem(LOCAL_USER_KEY);
  return local ? JSON.parse(local) : null;
}

// Sign in with Google (OAuth)
export async function signInWithGoogle() {
  if (supabase) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return;
  }

  // Fallback demo account for immediate local testing
  const demoUser = {
    id: 'demo-user-123',
    email: 'user@jumpin.music',
    user_metadata: {
      full_name: 'JumpIn Explorer',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    }
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
  return demoUser;
}

// Sign Out
export async function signOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

// Liked Songs Management
export async function getLikedSongs(userId) {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getLikedSongs fallback:', err);
    }
  }
  const local = localStorage.getItem(LOCAL_LIKED_KEY);
  return local ? JSON.parse(local) : [];
}

export async function toggleLikedSong(userId, track) {
  const current = await getLikedSongs(userId);
  const exists = current.some(t => t.id === track.id);
  const updated = exists 
    ? current.filter(t => t.id !== track.id)
    : [track, ...current];

  localStorage.setItem(LOCAL_LIKED_KEY, JSON.stringify(updated));

  if (supabase && userId) {
    try {
      if (exists) {
        await supabase.from('liked_songs').delete().eq('user_id', userId).eq('song_id', track.id);
      } else {
        await supabase.from('liked_songs').insert({
          user_id: userId,
          song_id: track.id,
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          duration: track.duration,
          audio_url: track.audioUrl
        });
      }
    } catch (err) {
      console.warn('Supabase toggleLikedSong sync:', err);
    }
  }

  return { isLiked: !exists, likedList: updated };
}

// Playlists Management
export async function getUserPlaylists(userId) {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase getUserPlaylists fallback:', err);
    }
  }
  const local = localStorage.getItem(LOCAL_PLAYLISTS_KEY);
  return local ? JSON.parse(local) : [];
}

export async function createPlaylist(userId, name, tracks = []) {
  const current = await getUserPlaylists(userId);
  const newPlaylist = {
    id: 'pl-' + Date.now(),
    name,
    tracks,
    cover: tracks[0]?.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  const updated = [newPlaylist, ...current];
  localStorage.setItem(LOCAL_PLAYLISTS_KEY, JSON.stringify(updated));

  if (supabase && userId) {
    try {
      await supabase.from('playlists').insert({
        id: newPlaylist.id,
        user_id: userId,
        name: newPlaylist.name,
        tracks: newPlaylist.tracks,
        cover: newPlaylist.cover
      });
    } catch (err) {
      console.warn('Supabase createPlaylist sync:', err);
    }
  }

  return updated;
}
