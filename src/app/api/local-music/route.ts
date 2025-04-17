import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type MusicType = 'pop' | 'rock' | 'jazz' | 'classical' | 'electronic' | 'other';

const defaultThumbnails: Record<MusicType, string> = {
  pop: '/Music/covers/default-pop.jpg',
  rock: '/Music/covers/default-rock.jpg',
  jazz: '/Music/covers/default-jazz.jpg',
  classical: '/Music/covers/default-classical.jpg',
  electronic: '/Music/covers/default-electronic.jpg',
  other: '/Music/covers/default-music.jpg',
};

function determineMusicType(filename: string): MusicType {
  const lowerName = filename.toLowerCase();
  if (lowerName.includes('pop')) return 'pop';
  if (lowerName.includes('rock')) return 'rock';
  if (lowerName.includes('jazz')) return 'jazz';
  if (lowerName.includes('classical')) return 'classical';
  if (lowerName.includes('electronic')) return 'electronic';
  return 'other';
}

async function getAllMusicFiles(dir: string): Promise<{ name: string; path: string; thumbnail: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllMusicFiles(fullPath);
      } else if (entry.name.endsWith('.mp3')) {
        // Convert Windows path to URL path
        const relativePath = fullPath.replace(process.cwd() + '\\public', '').replace(/\\/g, '/');
        
        // Determine the type based on the file name or other logic
        const type = determineMusicType(entry.name); // Implement this function based on your logic
        
        return [{
          name: entry.name,
          path: relativePath,
          thumbnail: defaultThumbnails[type] || defaultThumbnails.other // Use default if type not found
        }];
      }
      return [];
    })
  );

  return files.flat();
}

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public', 'Music');
    const musicFiles = await getAllMusicFiles(musicDir);

    return NextResponse.json({ files: musicFiles });
  } catch (error) {
    console.error('Error reading music directory:', error);
    return NextResponse.json({ error: 'Failed to read music files' }, { status: 500 });
  }
} 