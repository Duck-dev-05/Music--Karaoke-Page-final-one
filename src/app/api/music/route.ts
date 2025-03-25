import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface MusicFile {
  title: string;
  type: string;
  duration: string;
  path: string;
  dateAdded: Date;
  artist?: string;
  imageUrl?: string;
}

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
  songs: MusicFile[];
}

function cleanTitle(filename: string): { title: string; artist?: string } {
  // Remove file extension
  let name = filename.replace('.mp3', '');
  
  // Remove y2mate.com prefix if exists
  name = name.replace('y2mate.com - ', '');
  
  // Split artist and title if separated by ' - ' or '  '
  let artist: string | undefined;
  let title: string = name;
  
  if (name.includes(' - ')) {
    [artist, title] = name.split(' - ').map(s => s.trim());
  } else if (name.includes('  ')) {
    [artist, title] = name.split('  ').map(s => s.trim());
  }
  
  return { title, artist };
}

function getSongType(title: string): string {
  const types = {
    pop: ['pop', 'dance', 'disco'],
    rock: ['rock', 'metal', 'punk', 'guitar'],
    remix: ['remix', 'edm', 'techno', 'house'],
    traditional: ['arirang', 'dân ca', 'quê hương'],
    karaoke: ['karaoke'],
    sentai: ['sentai', 'gokaiger'],
    other: []
  };

  const lowerTitle = title.toLowerCase();
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return type;
    }
  }

  return 'other';
}

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public', 'Music');
    const files = await fs.readdir(musicDir);
    
    const musicFiles: MusicFile[] = await Promise.all(
      files
        .filter(file => file.toLowerCase().endsWith('.mp3'))
        .map(async (file) => {
          const filePath = path.join(musicDir, file);
          const stats = await fs.stat(filePath);
          const { title, artist } = cleanTitle(file);
          
          return {
            title,
            artist,
            type: getSongType(title),
            duration: "0:00", // Duration will be set client-side when audio loads
            path: `/Music/${file}`,
            dateAdded: stats.mtime
          };
        })
    );

    // Sort by date added, newest first
    musicFiles.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

    // Group into collections
    const collections: Collection[] = [
      {
        title: 'Recent Additions',
        count: Math.min(musicFiles.length, 6),
        description: 'Recently added songs to your library',
        category: 'recent',
        gradient: 'from-purple-500 to-blue-500',
        songs: musicFiles.slice(0, 6)
      },
      {
        title: 'Vietnamese Songs',
        count: musicFiles.filter(song => 
          song.title.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i)
        ).length,
        description: 'Collection of Vietnamese music',
        category: 'vietnamese',
        gradient: 'from-red-500 to-yellow-500',
        songs: musicFiles.filter(song => 
          song.title.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i)
        )
      },
      {
        title: 'Remixes',
        count: musicFiles.filter(song => song.type === 'remix').length,
        description: 'Remixed and electronic versions',
        category: 'remix',
        gradient: 'from-pink-500 to-rose-500',
        songs: musicFiles.filter(song => song.type === 'remix')
      },
      {
        title: 'All Songs',
        count: musicFiles.length,
        description: 'Complete music collection',
        category: 'all',
        gradient: 'from-green-500 to-emerald-500',
        songs: musicFiles
      }
    ];

    return NextResponse.json({
      success: true,
      collections,
      recentMusic: musicFiles.slice(0, 8) // Show 8 most recent songs
    });
  } catch (error) {
    console.error('Error reading music files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch music data' },
      { status: 500 }
    );
  }
}