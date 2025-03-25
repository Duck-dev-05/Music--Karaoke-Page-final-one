'use client';

import { useState } from 'react';
import { PlayIcon, PlusIcon } from '@heroicons/react/24/solid';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
}

// Sample data (replace with actual data from your backend)
const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Hãy Trao Cho Anh',
    artist: 'Sơn Tùng M-TP',
    duration: '4:05',
    thumbnail: '/song-thumbnails/hay-trao-cho-anh.jpg',
  },
  {
    id: '2',
    title: 'Chúng Ta Của Hiện Tại',
    artist: 'Sơn Tùng M-TP',
    duration: '3:52',
    thumbnail: '/song-thumbnails/chung-ta-cua-hien-tai.jpg',
  },
  // Add more songs here
];

export default function SongList() {
  const [selectedSong, setSelectedSong] = useState<string | null>(null);

  const handlePlay = (songId: string) => {
    setSelectedSong(songId);
    // Implement play functionality
    console.log('Playing song:', songId);
  };

  const handleAddToQueue = (songId: string) => {
    // Implement add to queue functionality
    console.log('Adding to queue:', songId);
  };

  return (
    <div className="bg-darkest rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách bài hát</h2>
      <div className="space-y-2">
        {sampleSongs.map((song) => (
          <div
            key={song.id}
            className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary transition cursor-pointer ${
              selectedSong === song.id ? 'bg-secondary' : ''
            }`}
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => handlePlay(song.id)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition rounded"
              >
                <PlayIcon className="w-8 h-8 text-primary" />
              </button>
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-light">{song.artist}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-light">{song.duration}</span>
              <button
                onClick={() => handleAddToQueue(song.id)}
                className="p-2 rounded-full hover:bg-primary/20 transition"
              >
                <PlusIcon className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 