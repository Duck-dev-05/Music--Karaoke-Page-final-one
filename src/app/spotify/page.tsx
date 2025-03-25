'use client';

import { useState } from 'react';
import { MusicTrack } from '@/services/music-sources';
import { searchSpotifyTracks } from '@/services/spotify';
import { MusicPlayer } from '@/components/MusicPlayer';
import { SpotifySearch } from '@/components/SpotifySearch';
import { SpotifyTrackList } from '@/components/SpotifyTrackList';
import { usePlayerControls } from '@/hooks/usePlayerControls';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

export default function SpotifyPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleTimeUpdate,
    handleDurationChange,
    handleVolumeChange,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    handleSongEnd,
    setIsPlaying,
  } = usePlayerControls(tracks);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchSpotifyTracks(searchQuery);
      setTracks(results);
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    // TODO: Implement Spotify connection
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <MusicalNoteIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Music Library</h1>
          </div>
          <Button variant="outline" onClick={() => {}}>Add New Song</Button>
        </header>

        <SpotifySearch
          searchQuery={searchQuery}
          isLoading={isLoading}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <Tabs defaultValue="local" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="local">Local Library</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
            <TabsTrigger value="mixcloud">Mixcloud</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Music</TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-4">
            {/* Local library content */}
          </TabsContent>

          <TabsContent value="spotify" className="mt-4">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-20">
                <MusicalNoteIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  Connect your Spotify account to view songs
                </p>
                <Button onClick={handleConnect}>Connect Spotify</Button>
              </div>
            ) : (
              <SpotifyTrackList
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            )}
          </TabsContent>

          <TabsContent value="mixcloud" className="mt-4">
            {/* Mixcloud content */}
          </TabsContent>

          <TabsContent value="youtube" className="mt-4">
            {/* YouTube Music content */}
          </TabsContent>
        </Tabs>
      </div>

      <MusicPlayer
        currentSong={currentTrack ? {
          title: currentTrack.title,
          artist: currentTrack.artist,
          path: currentTrack.previewUrl || currentTrack.sourceUrl || '',
        } : null}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isRepeat={isRepeat}
        isShuffle={isShuffle}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onToggleRepeat={toggleRepeat}
        onToggleShuffle={toggleShuffle}
        onEnded={handleSongEnd}
      />
    </div>
  );
} 