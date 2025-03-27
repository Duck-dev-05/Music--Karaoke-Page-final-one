'use client';

import { useEffect, useRef } from 'react';
import { YouTubeVideo } from '@/lib/youtube';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        elementId: string,
        options: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            disablekb?: number;
            enablejsapi?: number;
            fs?: number;
            modestbranding?: number;
            rel?: number;
            showinfo?: number;
            iv_load_policy?: number;
            origin?: string;
            cc_load_policy?: number;
            playsinline?: number;
          };
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

interface YouTubePlayerProps {
  video: YouTubeVideo | null;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (state: number) => void;
}

export default function YouTubePlayer({
  video,
  isPlaying,
  isMuted,
  onStateChange,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const playerContainerId = 'youtube-player';

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!window.YT) {
      console.log('YouTube API not loaded yet');
      return;
    }

    try {
      playerRef.current = new window.YT.Player(playerContainerId, {
        height: '100%',
        width: '100%',
        videoId: video?.id.videoId || '',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
          cc_load_policy: 0,
          playsinline: 1,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: (event: any) => onStateChange(event.data),
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
    }
  };

  const handlePlayerReady = () => {
    if (!playerRef.current) return;

    try {
      if (video && isPlaying) {
        playerRef.current.playVideo();
      }
      if (isMuted) {
        playerRef.current.mute();
      }
    } catch (error) {
      console.error('Error in player ready handler:', error);
    }
  };

  useEffect(() => {
    if (!playerRef.current || !video?.id.videoId) return;

    try {
      playerRef.current.loadVideoById({
        videoId: video.id.videoId,
        startSeconds: 0,
      });
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }, [video]);

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error('Error controlling playback:', error);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      }
    } catch (error) {
      console.error('Error controlling volume:', error);
    }
  }, [isMuted]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="relative w-full h-full max-w-screen-2xl mx-auto">
        <div
          id={playerContainerId}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
} 