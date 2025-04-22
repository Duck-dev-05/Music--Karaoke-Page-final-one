import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Clock, Award } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: string;
  isPrivate?: boolean;
  isRecent?: boolean;
  isVietnamese?: boolean;
  isRemix?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

interface PlaylistGridProps {
  playlists: Playlist[];
  isPremium: boolean;
}

export function PlaylistGrid({ playlists, isPremium }: PlaylistGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {playlists.map((playlist) => (
        <motion.div key={playlist.id} variants={item}>
          <Link href={`/playlists/${playlist.id}`}>
            <Card className="overflow-hidden group hover:bg-accent transition-colors cursor-pointer border border-border/50">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={
                      playlist.isRecent ? "default" : 
                      playlist.isVietnamese ? "outline" : 
                      "secondary"
                    }
                    className="px-2 py-1"
                  >
                    {playlist.isRecent ? "Recent" : 
                     playlist.isVietnamese ? "Vietnamese" : 
                     "Remix"}
                  </Badge>
                  {isPremium && (
                    <Badge variant="premium" className="px-2 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {playlist.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {playlist.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    {playlist.songs.length} songs
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(playlist.songs.reduce((acc, song) => {
                      const [mins, secs] = song.duration.split(':').map(Number);
                      return acc + (mins * 60 + secs);
                    }, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 