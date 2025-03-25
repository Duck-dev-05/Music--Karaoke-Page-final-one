interface MusicFile {
  title: string;
  type: string;
  duration: string;
  path: string;
  dateAdded: Date;
}

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
  songs: MusicFile[];
}

export function categorizeMusicFiles(files: string[]): { collections: Collection[], recentMusic: MusicFile[] } {
  const musicFiles = files.map(file => {
    // Remove file extension and clean up title
    const title = file.replace('.mp3', '').replace('y2mate.com - ', '');
    
    // Determine type based on title
    let type = "Other";
    if (title.match(/remix|karaoke/i)) {
      type = "Remix";
    } else if (title.match(/gokaiger|sentai|anime/i)) {
      type = "Anime";
    } else if (title.match(/việt nam|xuân|tuấn hưng|hoài linh|như quỳnh|gánh mẹ/i)) {
      type = "Vietnamese";
    }

    return {
      title,
      type,
      duration: "4:00", // This would need to be calculated from actual file metadata
      path: `/Music/${file}`,
      dateAdded: new Date(files.indexOf(file)) // This should be replaced with actual file dates
    };
  });

  // Create collections
  const vietnameseHits = musicFiles.filter(f => f.type === "Vietnamese");
  const remixCollection = musicFiles.filter(f => f.type === "Remix");
  const animeCollection = musicFiles.filter(f => f.type === "Anime");
  const recentAdditions = [...musicFiles].sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

  const collections: Collection[] = [
    {
      title: "Vietnamese Hits",
      count: vietnameseHits.length,
      description: "Popular Vietnamese music",
      category: "playlist",
      gradient: "from-red-500 to-orange-500",
      songs: vietnameseHits
    },
    {
      title: "Remix Collection",
      count: remixCollection.length,
      description: "Popular remixes",
      category: "playlist",
      gradient: "from-blue-500 to-purple-500",
      songs: remixCollection
    },
    {
      title: "Anime & Game",
      count: animeCollection.length,
      description: "Anime and game themes",
      category: "playlist",
      gradient: "from-green-500 to-teal-500",
      songs: animeCollection
    },
    {
      title: "Recent Additions",
      count: Math.min(recentAdditions.length, 15),
      description: "Recently added music",
      category: "playlist",
      gradient: "from-yellow-500 to-pink-500",
      songs: recentAdditions.slice(0, 15)
    }
  ];

  return {
    collections,
    recentMusic: recentAdditions.slice(0, 4) // Get only 4 most recent songs
  };
} 