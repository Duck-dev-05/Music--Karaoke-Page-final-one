import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlayIcon, PauseIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { MusicTrack } from '@/services/music-sources';

interface SpotifyTrackCardProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlayPause: (track: MusicTrack) => void;
}

export function SpotifyTrackCard({ track, isPlaying, onPlayPause }: SpotifyTrackCardProps) {
  return (
    <Card className="group relative overflow-hidden hover:bg-accent transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={track.thumbnail}
              alt={track.title}
              fill
              className="object-cover rounded-md"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-black/70 transition-all duration-200"
              onClick={() => onPlayPause(track)}
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6 text-white" />
              ) : (
                <PlayIcon className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{track.duration}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <HeartIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 