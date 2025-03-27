'use client';

import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  onEnded: () => void;
}

export default function VideoPlayer({ videoId, onEnded }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Reset player when video changes
    if (playerRef.current) {
      playerRef.current.internalPlayer?.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <YouTube
        videoId={videoId}
        onEnd={onEnded}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            showinfo: 0,
            mute: 0,
            modestbranding: 1
          },
        }}
        className="w-full aspect-video"
        onReady={(event: any) => {
          playerRef.current = event.target;
        }}
      />
    </div>
  );
}