'use client';

import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { KaraokeSong } from '@/types/song';

interface VideoPlayerProps {
  videoId: string;
  onEnded: () => void;
  nextSong: KaraokeSong | null;
  onPlayNext: () => void;
}

export default function VideoPlayer({ videoId, onEnded, nextSong, onPlayNext }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 1,
      playsinline: 1,
      enablejsapi: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  const handleReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const handleStateChange = (event: YouTubeEvent) => {
    // YouTube player state
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 0) {
      onEnded();
    }
  };

  const handleError = (error: YouTubeEvent) => {
    console.error('YouTube Player Error:', error);
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />

      {nextSong && (
        <div className="absolute bottom-0 right-0 p-4 bg-black/80 text-white">
          <p className="text-sm">Next: {nextSong.title}</p>
        </div>
      )}
    </div>
  );
}