import fs from 'fs';
import path from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';

interface Song {
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

async function loadSongs(): Promise<Song[]> {
  const musicDir = path.join(process.cwd(), 'public', 'Music');
  const files = fs.readdirSync(musicDir);
  
  const songs: Song[] = [];
  
  for (const file of files) {
    if (file.endsWith('.mp3')) {
      const filePath = path.join(musicDir, file);
      const duration = await getAudioDurationInSeconds(filePath);
      
      // Extract title and artist from filename
      let title = file.replace('.mp3', '');
      let artist = 'Unknown Artist';
      
      // Handle y2mate.com format
      if (title.startsWith('y2mate.com - ')) {
        title = title.replace('y2mate.com - ', '');
      }
      
      // Try to extract artist if there's a hyphen or dash
      const separators = [' - ', ' – ', ' — '];
      for (const separator of separators) {
        if (title.includes(separator)) {
          [artist, title] = title.split(separator);
          break;
        }
      }
      
      songs.push({
        title: title.trim(),
        artist: artist.trim(),
        duration: Math.round(duration),
        audioUrl: `/Music/${file}`
      });
    }
  }
  
  return songs;
}

async function addToFavorites(songs: Song[]) {
  try {
    const response = await fetch('http://localhost:3000/api/users/favorites/add-bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songs }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add favorites');
    }
    
    console.log('Success:', data.message);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
loadSongs()
  .then(songs => {
    console.log(`Found ${songs.length} songs:`, songs);
    return addToFavorites(songs);
  })
  .catch(console.error); 