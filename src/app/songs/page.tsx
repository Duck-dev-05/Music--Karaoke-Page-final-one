'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  MusicalNoteIcon as MusicIcon, 
  PlayIcon, 
  PauseIcon,
  PlusIcon,
  UserCircleIcon,
  ForwardIcon,
  BackwardIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { MusicPlayer } from '@/components/MusicPlayer';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MusicFile {
  title: string;
  type: keyof typeof defaultCoverImages;
  duration: string;
  path: string;
  dateAdded: Date;
  artist?: string;
  imageUrl?: string;
}

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
  songs: MusicFile[];
}

const defaultCoverImages = {
  pop: '/Music/covers/default-pop.jpg',
  rock: '/Music/covers/default-rock.jpg',
  jazz: '/Music/covers/default-jazz.jpg',
  classical: '/Music/covers/default-classical.jpg',
  electronic: '/Music/covers/default-electronic.jpg',
  other: '/Music/covers/default-music.jpg',
};

export default function SongsPage() {
  const [songs, setSongs] = useState<MusicFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('local');
  const [currentSong, setCurrentSong] = useState<MusicFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle song changes and playback
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    audio.src = currentSong.path;
    audio.load();

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentSong, isPlaying]);

  useEffect(() => {
    async function fetchMusicData() {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();
        if (data.success) {
          const allSongs = data.collections.reduce((acc: MusicFile[], collection: Collection) => {
            return [...acc, ...collection.songs];
          }, []);
          setSongs(allSongs);
        } else {
          setError('Failed to load music data.');
        }
      } catch (error) {
        console.error('Error fetching music data:', error);
        setError('Error fetching music data.');
      } finally {
        setIsLoading(false);
      }
    }

    if (activeTab === 'local') {
      fetchMusicData();
    } else {
      setIsLoading(false);
      setSongs([]);
    }
  }, [activeTab]);

  const handlePlayPause = (song: MusicFile) => {
    if (!audioRef.current) return;

    if (currentSong?.path === song.path) {
      // Toggle play/pause for current song
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      // Switch to new song
      if (currentSong) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (songs.length === 0 || !currentSong) return;
    const currentIndex = songs.findIndex(song => song.path === currentSong.path);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
    setCurrentSong(songs[newIndex]);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (songs.length === 0 || !currentSong) return;
    const currentIndex = songs.findIndex(song => song.path === currentSong.path);
    const newIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
    setCurrentSong(songs[newIndex]);
    setIsPlaying(true);
  };

  const handleTimeUpdate = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleSongEnd = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
      setIsPlaying(true);
    } else {
      handleNext();
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    if (activeTab !== 'local') {
      return (
        <div className="text-center py-12">
          <MusicIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Connect your {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} account to view songs
          </p>
          <Button className="mt-4">
            Connect {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading music library...</p>
        </div>
      );
    }

    if (!isLoading && filteredSongs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'No songs found matching your search.' : 'No songs in your library yet.'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
        {filteredSongs.map((song, index) => (
          <Card 
            key={index} 
            className={cn(
              "group hover:bg-muted/50 transition-all duration-300 cursor-pointer overflow-hidden",
              currentSong?.path === song.path ? "bg-muted/50" : ""
            )}
            onClick={() => handlePlayPause(song)}
          >
            <CardContent className="p-6">
              <div className="aspect-square bg-muted/30 rounded-lg mb-4 relative flex items-center justify-center overflow-hidden group/button">
                {song.imageUrl ? (
                  <Image
                    src={song.imageUrl}
                    alt={song.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <MusicIcon className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  "bg-black/0 group-hover:bg-black/60",
                  "opacity-0 group-hover:opacity-100"
                )}>
                  {currentSong?.path === song.path && isPlaying ? (
                    <PauseIcon className="w-16 h-16 text-white hover:text-white/90 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                  ) : (
                    <PlayIcon className="w-16 h-16 text-white hover:text-white/90 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-lg truncate mb-1">{song.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {song.artist && <span className="font-medium text-foreground/80">{song.artist}</span>}
                {song.artist && song.type && <span>•</span>}
                <span>{song.type}</span>
                <span>•</span>
                <span>{song.duration}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Music Library</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handlePrevious} disabled={!currentSong}>
            <BackwardIcon className="w-5 h-5" />
          </Button>
          <Button onClick={handleNext} disabled={!currentSong}>
            <ForwardIcon className="w-5 h-5" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Song
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <MusicIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Tabs defaultValue="local" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="local">Local Library</TabsTrigger>
          <TabsTrigger value="spotify">Spotify</TabsTrigger>
          <TabsTrigger value="mixcloud">Mixcloud</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Music</TabsTrigger>
        </TabsList>
      </Tabs>

      {renderContent()}

      {currentSong && (
        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isRepeat={isRepeat}
          isShuffle={isShuffle}
          onPlayPause={() => {
            if (!audioRef.current || !currentSong) return;
            
            if (isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            } else {
              audioRef.current.play().catch(error => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
              });
              setIsPlaying(true);
            }
          }}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={() => {}}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleRepeat={toggleRepeat}
          onToggleShuffle={toggleShuffle}
          onEnded={handleSongEnd}
        />
      )}
    </div>
  );
}
