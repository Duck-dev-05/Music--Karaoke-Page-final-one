'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import VideoPlayer from '@/components/VideoPlayer';
import { 
  PlayIcon, 
  PauseIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  ForwardIcon,
  BackwardIcon,
  QuestionMarkCircleIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface KaraokeSong {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  videoId: string;
}

export default function KaraokePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KaraokeSong[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<KaraokeSong[]>([]);
  const [currentSong, setCurrentSong] = useState<KaraokeSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  const { theme, setTheme } = useTheme();
  const playerRef = useRef<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube Player
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Unexpected server response. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search');
      }

      if (!data.items?.length) {
        setSearchError('No results found');
        setSearchResults([]);
        return;
      }

      setSearchResults(data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        videoId: item.id.videoId,
        duration: '', // YouTube API v3 doesn't provide duration in search results
      })));
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to search');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlayerReady = (event: any) => {
    console.log('Player ready');
    event.target.setVolume(50);
  };

  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.ENDED:
        handleNextSong();
        break;
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
    }
  };

  const onPlayerError = (event: any) => {
    console.error('YouTube Player Error:', event);
    setIsPlaying(false);
    handleNextSong(); // Skip to next song on error
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNextSong = () => {
    if (!currentSong || selectedSongs.length === 0) return;
    
    const currentIndex = selectedSongs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;
    
    // Remove the current song from queue
    const updatedSongs = [...selectedSongs];
    updatedSongs.splice(currentIndex, 1);
    setSelectedSongs(updatedSongs);

    // Play next song if available
    if (currentIndex < selectedSongs.length - 1) {
      setCurrentSong(selectedSongs[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handlePrevSong = () => {
    if (selectedSongs.length === 0) return;
    
    const currentIndex = selectedSongs.findIndex(song => song.id === currentSong?.id);
    const prevSong = selectedSongs[currentIndex - 1] || selectedSongs[selectedSongs.length - 1];
    
    if (prevSong) {
      setCurrentSong(prevSong);
      try {
        playerRef.current?.loadVideoById({
          videoId: prevSong.videoId,
          startSeconds: 0,
        });
        setIsPlaying(true);
      } catch (error) {
        console.error('Error loading previous video:', error);
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    try {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleAddToQueue = (song: KaraokeSong) => {
    // Check if song is already in queue
    const isInQueue = selectedSongs.some(s => s.id === song.id);
    if (isInQueue) {
      return; // Silently ignore if already in queue
    }

    setSelectedSongs(prev => {
      const newSongs = [...prev, song];
      // If this is the first song, set it as current and start playing
      if (!currentSong) {
        setCurrentSong(song);
      }
      return newSongs;
    });
  };

  const handleRemoveFromQueue = (index: number) => {
    setSelectedSongs(prev => {
      const newSongs = [...prev];
      const removedSong = newSongs[index];
      newSongs.splice(index, 1);

      // If removing current song, play next song if available
      if (currentSong?.id === removedSong.id) {
        if (newSongs.length > 0) {
          const nextIndex = index < newSongs.length ? index : 0;
          setCurrentSong(newSongs[nextIndex]);
        } else {
          setCurrentSong(null);
        }
      }
      return newSongs;
    });
  };

  const getNextSong = () => {
    if (!currentSong || selectedSongs.length === 0) return null;
    const currentIndex = selectedSongs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1 || currentIndex === selectedSongs.length - 1) return null;
    return selectedSongs[currentIndex + 1];
  };

  const handlePlayNext = () => {
    handleNextSong();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Video Player */}
          <div className="lg:col-span-2">
            <Card className="w-full aspect-video bg-black overflow-hidden">
              {currentSong ? (
                <div className="w-full h-full">
                  <VideoPlayer
                    videoId={currentSong.videoId}
                    onEnded={handleNextSong}
                    nextSong={getNextSong()}
                    onPlayNext={handlePlayNext}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <p>Select a song to start</p>
                </div>
              )}
            </Card>

            {/* Player Controls */}
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePrevSong()}
                    disabled={!currentSong}
                  >
                    <BackwardIcon className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNextSong()}
                    disabled={!currentSong}
                  >
                    <ForwardIcon className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="h-6 w-6" />
                    ) : (
                      <SpeakerWaveIcon className="h-6 w-6" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="h-6 w-6" />
                    ) : (
                      <MoonIcon className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Premium-only Download Button */}
            <div className="mt-4 flex flex-col items-center">
              {session?.user?.premium ? (
                <Button className="w-full max-w-xs" variant="primary">
                  Download Karaoke (Premium)
                </Button>
              ) : (
                <div className="w-full max-w-xs p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-center text-sm">
                  <b>Premium only:</b> Download karaoke tracks with a premium subscription.<br />
                  <a href="/payment" className="underline text-yellow-700 hover:text-yellow-900">Upgrade now</a>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Search and Queue */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="search" className="flex-1">
                    Search
                  </TabsTrigger>
                  <TabsTrigger value="queue" className="flex-1">
                    Queue ({selectedSongs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="mt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search for songs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {searchError && (
                    <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                      {searchError}
                    </div>
                  )}

                  <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
                    {searchResults.map((song) => {
                      const isInQueue = selectedSongs.some(s => s.id === song.id);
                      return (
                        <Card
                          key={song.id}
                          className={`p-2 hover:bg-accent transition-colors ${
                            isInQueue ? 'border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative group w-24 h-16">
                              <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-full h-full object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-white hover:text-white hover:bg-white/20"
                                  onClick={() => {
                                    if (!isInQueue) {
                                      handleAddToQueue(song);
                                    }
                                  }}
                                >
                                  {isInQueue ? (
                                    <CheckIcon className="h-6 w-6" />
                                  ) : (
                                    <PlusIcon className="h-6 w-6" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {song.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {song.channelTitle}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={isInQueue ? 'text-primary' : ''}
                              onClick={() => {
                                if (!isInQueue) {
                                  handleAddToQueue(song);
                                }
                              }}
                            >
                              {isInQueue ? 'Added' : 'Add to Queue'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="queue" className="mt-4">
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {selectedSongs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No songs in queue</p>
                        <p className="text-sm mt-2">Search and add songs to get started</p>
                      </div>
                    ) : (
                      selectedSongs.map((song, index) => (
                        <Card
                          key={`${song.id}-${index}`}
                          className={`p-2 ${
                            currentSong?.id === song.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative w-24 h-16">
                              <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-full h-full object-cover rounded"
                              />
                              {currentSong?.id === song.id && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  {isPlaying ? (
                                    <PauseIcon className="h-6 w-6 text-white" />
                                  ) : (
                                    <PlayIcon className="h-6 w-6 text-white" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                  #{index + 1}
                                </span>
                                <p className="text-sm font-medium truncate">
                                  {song.title}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {song.channelTitle}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFromQueue(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon className="h-5 w-5" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}