const scopes = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ');

const params = {
  scope: scopes,
  client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
  response_type: 'code',
  redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || '',
};

const queryParamString = new URLSearchParams(params).toString();

const SPOTIFY_API = {
  AUTHORIZE: `https://accounts.spotify.com/authorize?${queryParamString}`,
  TOKEN: 'https://accounts.spotify.com/api/token',
  ME: 'https://api.spotify.com/v1/me',
  RECOMMENDATIONS: 'https://api.spotify.com/v1/recommendations',
  TOP_TRACKS: 'https://api.spotify.com/v1/me/top/tracks',
};

export const getSpotifyAuthUrl = () => SPOTIFY_API.AUTHORIZE;

export async function getAccessToken(code: string) {
  const response = await fetch(SPOTIFY_API.TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  return response.json();
}

export async function getRecommendations(accessToken: string) {
  const response = await fetch(`${SPOTIFY_API.RECOMMENDATIONS}?limit=20&seed_genres=pop,rock,hip-hop`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
} 