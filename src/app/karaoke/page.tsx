'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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
  const { theme, setTheme } = useTheme();
  const playerRef = useRef<any>(null);

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
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search');
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
        handleNext();
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
    handleNext(); // Skip to next song on error
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

  const handleNext = () => {
    if (selectedSongs.length === 0) return;
    
    const currentIndex = selectedSongs.findIndex(song => song.id === currentSong?.id);
    const nextSong = selectedSongs[currentIndex + 1] || selectedSongs[0];
    
    if (nextSong) {
      setCurrentSong(nextSong);
      try {
        playerRef.current?.loadVideoById({
          videoId: nextSong.videoId,
          startSeconds: 0,
        });
        setIsPlaying(true);
      } catch (error) {
        console.error('Error loading next video:', error);
      }
    }
  };

  const handlePrevious = () => {
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

  const addToPlaylist = (song: KaraokeSong) => {
    setSelectedSongs(prev => {
      const newSongs = [...prev, song];
      // If this is the first song, set it as current and start playing
      if (prev.length === 0) {
        setCurrentSong(song);
        try {
          playerRef.current?.loadVideoById({
            videoId: song.videoId,
            startSeconds: 0,
          });
          setIsPlaying(true);
        } catch (error) {
          console.error('Error loading first song:', error);
        }
      }
      return newSongs;
    });
  };

  const removeFromPlaylist = (songId: string) => {
    setSelectedSongs(prev => {
      const newSongs = prev.filter(song => song.id !== songId);
      // If removing current song, play next song
      if (currentSong?.id === songId && newSongs.length > 0) {
        const nextSong = newSongs[0];
        setCurrentSong(nextSong);
        try {
          playerRef.current?.loadVideoById({
            videoId: nextSong.videoId,
            startSeconds: 0,
          });
          setIsPlaying(true);
        } catch (error) {
          console.error('Error loading next song after remove:', error);
        }
      }
      return newSongs;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-900">
      <div className="container mx-auto px-4 pt-20 pb-24">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-12">
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
            >
              Tìm kiếm
            </TabsTrigger>
            <TabsTrigger 
              value="selected" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
            >
              Đã chọn ({selectedSongs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm bài hát karaoke..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-6 text-lg"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((song) => (
                <Card key={song.id} className="overflow-hidden group">
                  <div className="relative aspect-video">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-white/20"
                        onClick={() => addToPlaylist(song)}
                      >
                        <PlayIcon className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{song.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{song.channelTitle}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="selected" className="mt-6">
            {selectedSongs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có bài hát nào được chọn</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSongs.map((song, index) => (
                  <Card key={song.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <h3 className="font-medium truncate">{song.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{song.channelTitle}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromPlaylist(song.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="min-w-0">
                  <h3 className="font-medium truncate dark:text-white">{currentSong.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{currentSong.channelTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={handlePrevious}
                >
                  <BackwardIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={handleNext}
                >
                  <ForwardIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Player */}
      <div 
        id="youtube-player" 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          display: currentSong ? 'block' : 'none',
          zIndex: 50,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
} 