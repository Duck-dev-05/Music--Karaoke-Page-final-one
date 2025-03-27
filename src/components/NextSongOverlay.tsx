'use client';

import { Play } from 'lucide-react';

interface YouTubeVideo {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface NextSongOverlayProps {
  nextSong: YouTubeVideo;
  onPlay: () => void;
}

export default function NextSongOverlay({ nextSong, onPlay }: NextSongOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 bg-[#1a1a1a] rounded-lg overflow-hidden shadow-xl">
        <div className="p-6">
          <h2 className="text-white text-xl font-semibold mb-2">Next Song</h2>
          <div className="flex items-start space-x-4">
            <img
              src={nextSong.snippet.thumbnails.medium.url}
              alt={nextSong.snippet.title}
              className="w-32 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-white font-medium line-clamp-2">
                {nextSong.snippet.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                {nextSong.snippet.channelTitle}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onPlay}
              className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Play Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
