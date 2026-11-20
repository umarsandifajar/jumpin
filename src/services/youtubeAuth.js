// Google OAuth 2.0 & YouTube Data API v3 Integration
// Allows real user sign-in to fetch real existing playlists & liked videos from YouTube Music

export const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  '1033980516305-7h5c8fdlrktli0rfj25j1g68l3q208fu.apps.googleusercontent.com';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

// Dynamically load Google Identity Services SDK script
export function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      return resolve(window.google.accounts.oauth2);
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.onload = () => resolve(window.google.accounts.oauth2);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(window.google?.accounts?.oauth2);
    };
    script.onerror = (err) => reject(new Error('Failed to load Google SDK: ' + err));
    document.head.appendChild(script);
  });
}

// Trigger Google OAuth Sign In Popup with YouTube Scope
export async function loginWithGoogleYouTube() {
  await loadGsiScript();

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse);
            return reject(new Error(tokenResponse.error_description || tokenResponse.error));
          }

          const accessToken = tokenResponse.access_token;
          const expiresIn = parseInt(tokenResponse.expires_in, 10) || 3600;

          // Save session to localStorage
          localStorage.setItem('jumpin_google_token', accessToken);
          localStorage.setItem('jumpin_google_token_exp', Date.now() + (expiresIn * 1000));

          try {
            // Fetch real user profile, playlists, and liked tracks from Google/YouTube
            const profile = await fetchGoogleProfile(accessToken);
            const playlists = await fetchUserYouTubePlaylists(accessToken);
            const likedTracks = await fetchYouTubeLikedTracks(accessToken);

            // Cache data
            localStorage.setItem('jumpin_google_profile', JSON.stringify(profile));
            localStorage.setItem('jumpin_google_playlists', JSON.stringify(playlists));
            localStorage.setItem('jumpin_google_liked', JSON.stringify(likedTracks));

            resolve({ accessToken, profile, playlists, likedTracks });
          } catch (err) {
            reject(err);
          }
        }
      });

      // Prompt consent dialog
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      reject(err);
    }
  });
}

// Fetch Google User Profile (Name, Email, Profile Picture)
export async function fetchGoogleProfile(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Could not fetch Google profile');
  const data = await res.json();
  return {
    id: data.sub,
    name: data.name,
    email: data.email,
    avatar: data.picture
  };
}

// Search YouTube Music using official Google API with user token
export async function searchYouTubeOfficial(query, token) {
  if (!query || !query.trim()) return [];

  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=25&q=${encodeURIComponent(query)}`,
      { headers }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        return data.items
          .filter(item => item.id?.videoId)
          .map(item => {
            const videoId = item.id.videoId;
            const thumbs = item.snippet.thumbnails;
            const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            return {
              id: videoId,
              title: item.snippet.title,
              artist: item.snippet.channelTitle || 'YouTube Artist',
              album: 'YouTube Music',
              cover,
              audioUrl: `/api/stream?id=${videoId}`,
              isStream: true
            };
          });
      }
    }
  } catch (err) {
    console.warn('Official YouTube search error:', err);
  }
  return [];
}

// Fetch YouTube Trending / New Releases (Explore / New)
export async function fetchTrendingMusic(token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&maxResults=30',
      { headers }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map(item => {
      const videoId = item.id;
      const thumbs = item.snippet.thumbnails;
      const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      return {
        id: videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle || 'YouTube Artist',
        album: 'YouTube Trending',
        cover,
        audioUrl: `/api/stream?id=${videoId}`,
        isStream: true
      };
    });
  } catch (err) {
    console.warn('Trending music error:', err);
    return [];
  }
}

// Fetch all existing user playlists from YouTube Music / YouTube
export async function fetchUserYouTubePlaylists(token) {
  try {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map(item => {
      const thumbs = item.snippet.thumbnails;
      const bestCover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
      return {
        id: item.id,
        name: item.snippet.title,
        itemCount: item.contentDetails?.itemCount || 0,
        cover: bestCover
      };
    });
  } catch (err) {
    console.warn('Error fetching YouTube playlists:', err);
    return [];
  }
}

// Fetch all tracks inside a specific YouTube Playlist
export async function fetchPlaylistTracks(token, playlistId) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    return data.items
      .filter(item => {
        const title = item.snippet.title;
        return (
          item.snippet.resourceId?.videoId && 
          title !== 'Private video' && 
          title !== 'Deleted video'
        );
      })
      .map(item => {
        const videoId = item.snippet.resourceId.videoId;
        const thumbs = item.snippet.thumbnails;
        const cover = 
          thumbs?.high?.url || 
          thumbs?.medium?.url || 
          thumbs?.default?.url || 
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        return {
          id: videoId,
          title: item.snippet.title,
          artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || 'YouTube Artist',
          album: 'YouTube Playlist',
          cover,
          audioUrl: `/api/stream?id=${videoId}`,
          isStream: true
        };
      });
  } catch (err) {
    console.warn('Error fetching playlist tracks:', err);
    return [];
  }
}

// Fetch Liked Videos from user's YouTube account
export async function fetchYouTubeLikedTracks(token) {
  try {
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!channelRes.ok) return [];
    const channelData = await channelRes.json();
    const likedPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.likes;

    if (!likedPlaylistId) return [];
    return await fetchPlaylistTracks(token, likedPlaylistId);
  } catch (err) {
    console.warn('Error fetching liked videos:', err);
    return [];
  }
}

// Fetch Subscribed Artists / Channels from user's YouTube account
export async function fetchSubscribedArtists(token) {
  try {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map(item => ({
      id: item.snippet.resourceId.channelId,
      name: item.snippet.title,
      cover: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    }));
  } catch (err) {
    console.warn('Error fetching subscriptions:', err);
    return [];
  }
}

// Restore saved session from localStorage on startup
export function getSavedSession() {
  const token = localStorage.getItem('jumpin_google_token');
  const exp = localStorage.getItem('jumpin_google_token_exp');

  if (!token) return null;

  const isExpired = exp && Date.now() > parseInt(exp, 10);
  const profile = JSON.parse(localStorage.getItem('jumpin_google_profile') || 'null');
  const playlists = JSON.parse(localStorage.getItem('jumpin_google_playlists') || '[]');
  const liked = JSON.parse(localStorage.getItem('jumpin_google_liked') || '[]');

  return {
    token,
    isExpired,
    profile,
    playlists,
    liked
  };
}

// Sign out from Google session
export function logoutGoogle() {
  localStorage.removeItem('jumpin_google_token');
  localStorage.removeItem('jumpin_google_token_exp');
  localStorage.removeItem('jumpin_google_profile');
  localStorage.removeItem('jumpin_google_playlists');
  localStorage.removeItem('jumpin_google_liked');
}
