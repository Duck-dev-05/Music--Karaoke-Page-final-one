'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaHeart, FaPlay, FaEllipsisVertical, FaSearch, FaClock } from 'react-icons/fa6';

interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
  duration: string;
  addedAt: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/favorites');
      return;
    }
    
    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavorites(data.favorites.map((fav: any) => ({
        ...fav,
        duration: formatDuration(fav.duration || '0'),
        addedAt: new Date(fav.addedAt).toLocaleDateString()
      })));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (songId: string) => {
    try {
      const response = await fetch(`/api/favorites/${songId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');
      setFavorites(favorites.filter(song => song.id !== songId));
      toast({
        title: "Success",
        description: "Song removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove song. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playSong = (videoId: string) => {
    setCurrentlyPlaying(videoId);
    router.push(`/play/${videoId}`);
  };

  const playAll = () => {
    if (filteredFavorites.length > 0) {
      const firstSong = filteredFavorites[0];
      playSong(firstSong.videoId);
    }
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(parseInt(duration) / 60);
    const seconds = parseInt(duration) % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredFavorites = favorites.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-[300px]" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-start space-x-6">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <FaHeart className="w-24 h-24 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Favorite Songs</h1>
            <p className="text-gray-600 mb-4 text-lg">
              {favorites.length} {favorites.length === 1 ? 'song' : 'songs'} in your collection
            </p>
            {favorites.length > 0 && (
              <Button
                onClick={playAll}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <FaPlay className="mr-2 h-4 w-4" /> Play All
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search in favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 backdrop-blur-sm focus:bg-white transition-colors duration-200"
          />
        </div>

        {/* Songs Table */}
        {filteredFavorites.length === 0 ? (
          <Card className="p-8 text-center bg-white/95 backdrop-blur shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <FaHeart className="h-12 w-12 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">
                {searchQuery ? 'No matching songs found' : 'No favorites yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Start adding songs to your favorites!'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  Browse Songs
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden bg-white/95 backdrop-blur shadow-lg">
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead className="w-32 text-right">Added</TableHead>
                    <TableHead className="w-24 text-right"><FaClock className="ml-auto h-4 w-4" /></TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFavorites.map((song, index) => (
                    <TableRow
                      key={song.id}
                      className={`group hover:bg-accent/50 ${currentlyPlaying === song.videoId ? 'bg-accent/30' : ''}`}
                    >
                      <TableCell className="font-medium w-12">
                        <div className="relative w-8 h-8 flex items-center justify-center group">
                          <span className="group-hover:hidden">{index + 1}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hidden group-hover:flex absolute inset-0 h-8 w-8 p-2"
                            onClick={() => playSong(song.videoId)}
                          >
                            <FaPlay className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={song.thumbnailUrl}
                            alt={song.title}
                            className="h-10 w-10 rounded object-cover shadow-sm"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">{song.title}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{song.artist}</TableCell>
                      <TableCell className="text-right text-gray-600 text-sm">{song.addedAt}</TableCell>
                      <TableCell className="text-right text-gray-600">{song.duration}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaEllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                              onClick={() => removeFavorite(song.id)}
                            >
                              Remove from favorites
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
}
