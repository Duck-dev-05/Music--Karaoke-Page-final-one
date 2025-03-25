'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Sample playlist data - replace with actual data from API
const samplePlaylists = [
  {
    id: 1,
    name: 'Rock Classics',
    songCount: 12,
    createdAt: '2024-03-20',
  },
  {
    id: 2,
    name: 'Pop Hits',
    songCount: 8,
    createdAt: '2024-03-19',
  },
  {
    id: 3,
    name: 'Karaoke Favorites',
    songCount: 15,
    createdAt: '2024-03-18',
  },
];

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      // Replace with actual API call
      console.log('Creating playlist:', newPlaylistName);
      setNewPlaylistName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your playlists</h2>
        <Link
          href="/login"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Playlist
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700">
                Playlist Name
              </label>
              <input
                type="text"
                id="playlistName"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter playlist name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePlaylists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlists/${playlist.id}`}
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>
              <div className="text-gray-600">
                <p>{playlist.songCount} songs</p>
                <p className="text-sm">Created on {new Date(playlist.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 