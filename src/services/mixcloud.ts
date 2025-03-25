import { MusicTrack } from './music-sources';

const MIXCLOUD_API_URL = 'https://api.mixcloud.com';

export async function searchMixcloudTracks(query: string): Promise<MusicTrack[]> {
  try {
    const response = await fetch(
      `${MIXCLOUD_API_URL}/search/?q=${encodeURIComponent(query)}&type=cloudcast&limit=20`
    );

    if (!response.ok) {
      throw new Error('Failed to search Mixcloud tracks');
    }

    const data = await response.json();
    return data.data.map((track: any) => ({
      id: track.key,
      title: track.name,
      artist: track.user.name,
      thumbnail: track.pictures.medium,
      duration: formatDuration(track.audio_length),
      source: 'mixcloud' as const,
      sourceUrl: track.url,
    }));
  } catch (error) {
    console.error('Error searching Mixcloud tracks:', error);
    return [];
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 