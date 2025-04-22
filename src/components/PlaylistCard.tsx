import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ArrowDownToLine, Play, Pause } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl: string;
  isPremium: boolean;
}

interface PlaylistCardProps {
  playlist: Song;
  icon?: React.ReactNode;
  onPlayPause?: () => void;
  onFavorite?: () => void;
  onDownload?: () => void;
  isPlaying?: boolean;
  isFavorite?: boolean;
  showDownload?: boolean;
}

export function PlaylistCard({
  playlist,
  icon,
  onPlayPause,
  onFavorite,
  onDownload,
  isPlaying,
  isFavorite,
  showDownload
}: PlaylistCardProps) {
  return (
    <Card className="hover:bg-accent transition-colors">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{playlist.title}</h2>
            {playlist.isPremium && (
              <Badge variant="premium">
                {icon}
                Premium
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{playlist.artist}</p>
          <p className="text-sm text-muted-foreground">{playlist.duration}</p>
        </div>
        <div className="flex items-center gap-2">
          {onFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onFavorite}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}
          {showDownload && onDownload && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
            >
              <ArrowDownToLine className="h-5 w-5" />
            </Button>
          )}
          {onPlayPause && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 