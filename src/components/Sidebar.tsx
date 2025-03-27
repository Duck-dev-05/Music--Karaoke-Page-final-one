'use client';

import { useState, useEffect } from 'react';
import { Search, List, Heart, Play } from 'lucide-react';
import type { YouTubeVideo } from '@/services/youtube';

interface SidebarProps {
  searchQuery: string;
  activeTab: string;
  songs: YouTubeVideo[];
  selectedSongs: YouTubeVideo[];
  isLoading: boolean;
  error: string | null;
  onSearch: (query: string) => void;
  onTabChange: (tab: string) => void;
  onPlaySong: (song: YouTubeVideo) => void;
  onToggleSelect: (song: YouTubeVideo) => void;
}

export default function Sidebar({
  searchQuery,
  activeTab,
  songs,
  selectedSongs,
  isLoading,
  error,
  onSearch,
  onTabChange,
  onPlaySong,
  onToggleSelect,
}: SidebarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  const renderSongList = (songList: YouTubeVideo[]) => (
    <div className="space-y-2">
      {songList.map((song) => (
        <div
          key={song.id.videoId}
          className="flex items-center p-2 rounded hover:bg-[#2f2f35] group cursor-pointer"
          onClick={() => onPlaySong(song)}
        >
          <div className="relative flex-shrink-0 w-12 h-12 mr-3">
            <img
              src={song.snippet.thumbnails.medium.url}
              alt={song.snippet.title}
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">{song.snippet.title}</h3>
            <p className="text-xs text-gray-400 truncate">{song.snippet.channelTitle}</p>
          </div>
          <button
            className="ml-2 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(song);
            }}
          >
            <Heart 
              className={`h-5 w-5 ${
                selectedSongs.some((s) => s.id.videoId === song.id.videoId)
                  ? 'text-pink-500 fill-pink-500'
                  : 'text-gray-400 hover:text-pink-500'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <aside className="w-80 h-full flex flex-col bg-[#1a1a1c]">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search songs..."
            className="w-full p-2 pl-8 pr-4 rounded bg-[#2f2f35] text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          {isLoading && (
            <div className="absolute right-2 top-2">
              <div className="animate-spin h-5 w-5 border-2 border-pink-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-[#2f2f35]">
        <div className="flex">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'search'
                ? 'bg-[#2f2f35] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2f2f35]'
            }`}
            onClick={() => onTabChange('search')}
          >
            <span className="flex items-center justify-center">
              <Search className="mr-2 h-4 w-4" />
              Search
            </span>
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'queue'
                ? 'bg-[#2f2f35] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2f2f35]'
            }`}
            onClick={() => onTabChange('queue')}
          >
            <span className="flex items-center justify-center">
              <List className="mr-2 h-4 w-4" />
              Queue ({selectedSongs.length})
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'search' && (
          <>
            {error && songs.length === 0 && !isLoading ? (
              <div className="text-center py-8 text-gray-400">{error}</div>
            ) : songs.length === 0 && !isLoading && searchQuery.trim() ? (
              <div className="text-center py-8 text-gray-400">No results found</div>
            ) : songs.length === 0 && !isLoading ? (
              <div className="text-center py-8 text-gray-400">Search for songs</div>
            ) : (
              renderSongList(songs)
            )}
          </>
        )}

        {activeTab === 'queue' && (
          <>
            {selectedSongs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Queue is empty</div>
            ) : (
              renderSongList(selectedSongs)
            )}
          </>
        )}
      </div>
    </aside>
  );
}