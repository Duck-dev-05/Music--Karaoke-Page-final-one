import { MusicTrack } from '@/services/music-sources';
import { SpotifyTrackCard } from './SpotifyTrackCard';

interface SpotifyTrackListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: (track: MusicTrack) => void;
}

export function SpotifyTrackList({ tracks, currentTrack, isPlaying, onPlayPause }: SpotifyTrackListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <SpotifyTrackCard
          key={track.id}
          track={track}
          isPlaying={currentTrack?.id === track.id && isPlaying}
          onPlayPause={onPlayPause}
        />
      ))}
    </div>
  );
} 