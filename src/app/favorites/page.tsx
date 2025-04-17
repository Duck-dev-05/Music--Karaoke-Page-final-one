"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CircleDollarSignIcon, LockIcon, TrashIcon, PlayCircle, PauseCircle, Repeat, Volume2, VolumeX, SkipBack, SkipForward, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface FavoriteItem {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

// Actual songs from the Music directory
const actualSongs: FavoriteItem[] = [
  {
    id: "1",
    title: "Trường Sơn Đông Trường Sơn Tây Remix",
    artist: "Độ Mixi",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix.mp3"
  },
  {
    id: "2",
    title: "Đắp Mộ Cuộc Tình",
    artist: "Đan Nguyên, Bằng Kiều, Quang Lê",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126.mp3"
  },
  {
    id: "3",
    title: "Mùa Xuân",
    artist: "ARIRANG",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - mùa xuân ARIRANG karaoke.mp3"
  },
  {
    id: "4",
    title: "Way Back Home",
    artist: "SHAUN ft. Various Artists",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Way Back Home Về Nhà Thôi  SHAUN ft 20 Nghệ Sĩ Việt Nam  Gala Nhạc Việt Official MV.mp3"
  },
  {
    id: "5",
    title: "Sẽ Không Còn Nữa",
    artist: "Tuấn Hưng",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Sẽ Không Còn Nữa  Tuấn Hưng.mp3"
  },
  {
    id: "6",
    title: "Stream Đến Bao Giờ",
    artist: "Độ Mixi",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - STREAM ĐẾN BAO GIỜ  ĐỘ MIXI ft BẠN SÁNG TÁC OFFICIAL LYRICS VIDEO.mp3"
  },
  {
    id: "7",
    title: "Ông Trời Làm Tội Anh Chưa",
    artist: "RASTZ",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - RASTZ  ÔNG TRỜI LÀM TỘI ANH CHƯA  MINH HANH x QNT ft TUẤN CRY INSTRUMENTAL.mp3"
  },
  {
    id: "8",
    title: "Nắm",
    artist: "Hương Ly",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - NẮM  HƯƠNG LY  LIVE VERSION.mp3"
  },
  {
    id: "9",
    title: "Người Tình Mùa Đông",
    artist: "Như Quỳnh",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Người Tình Mùa Đông  Như Quỳnh ASIA 6.mp3"
  },
  {
    id: "10",
    title: "Tìm Lại Bầu Trời",
    artist: "Tuấn Hưng",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - NEU CONCERT 2022 TÌM LẠI BẦU TRỜI  TUẤN HƯNG.mp3"
  }
];

// Initial favorites based on user type
const initialFavorites = {
  premium: actualSongs,
  free: actualSongs.slice(0, 2), // Free users get first 2 songs
  preview: actualSongs.slice(0, 3) // Preview shows first 3 songs
};

// Format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();
  const progressTimeoutRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPremium = session?.user?.email === "premium@test.com";
  const isFreeUser = session?.user?.email === "free@test.com";

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Add event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
      audioRef.current.addEventListener('ended', handleSongEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
          audioRef.current.removeEventListener('ended', handleSongEnded);
        }
      };
    }
  }, []);

  // Handle time updates
  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle metadata loaded
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle song ended
  const handleSongEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      playNextSong();
    }
  };

  // Debounced time update to prevent excessive re-renders
  const debouncedTimeUpdate = useCallback((time: number) => {
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }
    progressTimeoutRef.current = setTimeout(() => {
      setCurrentTime(time);
    }, 50);
  }, []);

  // Smooth volume control
  const handleVolumeHover = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  // Handle time change
  const handleTimeChange = useCallback((value: number[]) => {
    setIsDragging(true);
    setCurrentTime(value[0]);
  }, []);

  const handleTimeChangeEnd = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
    setIsDragging(false);
  }, []);

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  // Toggle loop
  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = previousVolume;
        setVolume(previousVolume);
      } else {
        setPreviousVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  // Play next song
  const playNextSong = () => {
    if (favorites.length === 0) return;
    
    let nextIndex;
    if (isShuffling) {
      // Play random song excluding current song
      const availableIndices = Array.from(
        { length: favorites.length },
        (_, i) => i
      ).filter(i => i !== currentSongIndex);
      
      if (availableIndices.length === 0) return;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Play next song in sequence
      nextIndex = (currentSongIndex + 1) % favorites.length;
    }

    const nextSong = favorites[nextIndex];
    setCurrentSongIndex(nextIndex);
    playSong(nextSong.audioUrl, nextSong);
  };

  // Play previous song
  const playPreviousSong = () => {
    if (favorites.length === 0) return;
    
    const previousIndex = currentSongIndex === 0 ? favorites.length - 1 : currentSongIndex - 1;
    const previousSong = favorites[previousIndex];
    
    setCurrentSongIndex(previousIndex);
    playSong(previousSong.audioUrl, previousSong);
  };

  // Play song
  const playSong = (audioUrl: string, song: FavoriteItem) => {
    if (!session?.user) {
      handleLoginRedirect();
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Error playing audio. Please try again.');
      });
      setCurrentlyPlaying(audioUrl);
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Error playing audio. Please try again.');
      });
      setIsPlaying(true);
    }
  };

  // Get current song
  const getCurrentSong = () => {
    if (currentSongIndex === -1 || !favorites[currentSongIndex]) return null;
    return favorites[currentSongIndex];
  };

  useEffect(() => {
    if (status === 'loading') return;

    // Load favorites based on user status
    const loadFavorites = () => {
      setLoading(true);
      setTimeout(() => {
        if (!session?.user) {
          setFavorites([]);
        } else if (isPremium) {
          setFavorites(initialFavorites.premium);
        } else if (isFreeUser) {
          setFavorites(initialFavorites.free);
        }
        setLoading(false);
      }, 1000);
    };

    loadFavorites();

    // Show welcome message
    if (!session?.user) {
      toast.info("Please sign in to view favorites", {
        description: "Create an account or sign in to access your favorites",
        duration: 5000,
      });
    } else if (isPremium) {
      toast.success("Welcome to your premium favorites!");
    } else if (isFreeUser) {
      toast.success("Welcome to your favorites (Free Account: 2 max)");
    }
  }, [session, status, isPremium, isFreeUser]);

  const handleLoginRedirect = () => {
    toast.info("Please log in to continue", {
      description: "You'll be redirected to the login page",
      action: {
        label: "Continue",
        onClick: () => router.push('/login?callbackUrl=/favorites')
      },
      duration: 4000,
      onAutoClose: () => router.push('/login?callbackUrl=/favorites'),
    });
  };

  const handleRemoveFavorite = (id: string) => {
    if (!session?.user) {
      handleLoginRedirect();
      return;
    }
    setFavorites(prev => prev.filter(fav => fav.id !== id));
    toast.success("Removed from favorites");
  };

  const handlePlaySong = (audioUrl: string, song: FavoriteItem) => {
    if (!session?.user) {
      handleLoginRedirect();
      return;
    }
    
    const songIndex = favorites.findIndex(fav => fav.audioUrl === audioUrl);
    if (songIndex === -1) return;
    
    setCurrentSongIndex(songIndex);
    playSong(audioUrl, song);
  };

  const handleTryFeature = () => {
    handleLoginRedirect();
  };

  if (!session?.user) {
    return (
      <div className="container max-w-5xl py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="mb-6">
            <LockIcon className="h-5 w-5" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              Please sign in to view and manage your favorites.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="py-16">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Heart className="h-20 w-20 text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Your Favorites Await</h2>
                  <p className="text-muted-foreground">
                    Sign in to view, create, and manage your favorite songs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => {
                      toast.info("Please log in to continue", {
                        description: "You'll be redirected to the login page",
                        action: {
                          label: "Continue",
                          onClick: () => router.push('/login?callbackUrl=/favorites')
                        },
                        duration: 4000,
                        onAutoClose: () => router.push('/login?callbackUrl=/favorites'),
                      });
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      toast.info("Create your account", {
                        description: "You'll be redirected to the registration page",
                        action: {
                          label: "Continue",
                          onClick: () => router.push('/register')
                        },
                        duration: 4000,
                        onAutoClose: () => router.push('/register'),
                      });
                    }}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 px-4 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">
                  {session?.user ? "Your Favorites" : "Popular Favorites"}
                </CardTitle>
                <CardDescription>
                  {session?.user ? (
                    isPremium ? (
                      <span className="flex items-center gap-2">
                        Premium account: Unlimited favorites
                        <CircleDollarSignIcon className="h-4 w-4 text-yellow-500" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Free account: {favorites.length}/2 favorites used
                        <LockIcon className="h-4 w-4" />
                      </span>
                    )
                  ) : (
                    "Preview our most popular favorites"
                  )}
                </CardDescription>
              </div>
              {session?.user && isPremium && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 px-4 py-2 rounded-full">
                  <CircleDollarSignIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Premium Features Unlocked</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(session?.user ? favorites : initialFavorites.preview).map((favorite) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden group">
                      <div className="aspect-square relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Heart className={`h-12 w-12 ${session?.user ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:text-primary"
                            onClick={() => session?.user ? handlePlaySong(favorite.audioUrl, favorite) : handleTryFeature()}
                          >
                            <PlayCircle className="h-8 w-8" />
                          </Button>
                          {session?.user && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-white hover:text-destructive"
                              onClick={() => handleRemoveFavorite(favorite.id)}
                            >
                              <TrashIcon className="h-8 w-8" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{favorite.title}</h3>
                        <p className="text-sm text-muted-foreground">{favorite.artist}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!session?.user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 pt-8 border-t"
              >
                <div className="max-w-md mx-auto text-center space-y-6">
                  <h3 className="text-lg font-semibold">Ready to save your own favorites?</h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg"
                      onClick={() => {
                        toast.info("Redirecting to login...");
                        router.push('/login?callbackUrl=/favorites');
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        toast.info("Redirecting to registration...");
                        router.push('/register');
                      }}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Playbar */}
      <AnimatePresence>
        {currentlyPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50",
              isMinimized ? "h-16" : "h-auto"
            )}
          >
            <div className="container max-w-7xl mx-auto px-4 py-2">
              <div className={cn(
                "grid gap-4",
                isMinimized 
                  ? "grid-cols-[auto_1fr_auto] items-center" 
                  : "grid-cols-[1fr_2fr_1fr] items-center"
              )}>
                {/* Compact Song Info */}
                <motion.div layout className="flex items-center gap-2 min-w-0 max-w-[300px]">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0"
                  >
                    <Heart className="h-5 w-5 text-primary" />
                  </motion.div>
                  {(!isMinimized || isMinimized) && (
                    <div className="min-w-0 flex-1">
                      <motion.h4 layout className="font-medium truncate text-sm">
                        {getCurrentSong()?.title || 'Unknown'}
                      </motion.h4>
                      <motion.p layout className="text-xs text-muted-foreground truncate">
                        {getCurrentSong()?.artist || 'Unknown'}
                      </motion.p>
                    </div>
                  )}
                </motion.div>

                {/* Compact Controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("hover:text-primary transition-colors", isShuffling && "text-primary")}
                      onClick={toggleShuffle}
                    >
                      <Shuffle className={cn("h-5 w-5", isShuffling && "text-primary")} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={playPreviousSong}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <PauseCircle className="h-8 w-8" />
                        ) : (
                          <PlayCircle className="h-8 w-8" />
                        )}
                      </Button>
                    </motion.div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={playNextSong}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("hover:text-primary", isLooping && "text-primary")}
                      onClick={toggleLoop}
                    >
                      <Repeat className={cn("h-5 w-5", isLooping && "text-primary")} />
                    </Button>
                  </div>

                  {!isMinimized && (
                    <div className="flex items-center gap-2 w-full px-2">
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {formatTime(currentTime)}
                      </span>
                      <div className="relative flex-1">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={0.1}
                          onValueChange={handleTimeChange}
                          onValueCommit={handleTimeChangeEnd}
                          className="flex-1"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {formatTime(duration)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end gap-2">
                  <motion.div 
                    className="flex items-center gap-1"
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <AnimatePresence>
                      {(showVolumeSlider && !isMinimized) && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 80, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-20"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
