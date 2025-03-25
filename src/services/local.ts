import { MusicTrack } from './music-sources';

interface LocalFile extends MusicTrack {
  path: string;
}

let localFiles: LocalFile[] = [];

// Function to load existing music files
export async function loadExistingMusicFiles(files: { name: string, path: string }[]): Promise<void> {
  // Clear existing files
  localFiles = [];

  for (const file of files) {
    try {
      const audio = new Audio();
      
      // Use absolute URL for audio source
      const absolutePath = window.location.origin + file.path;
      audio.src = absolutePath;

      const newFile: LocalFile = {
        id: generateId(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Local File',
        thumbnail: '/images/music-placeholder.png',
        duration: '00:00', // We'll update this when the audio loads
        source: 'local' as const,
        path: absolutePath,
      };

      // Update duration when metadata is loaded
      audio.addEventListener('loadedmetadata', () => {
        newFile.duration = formatDuration(audio.duration);
      });

      audio.addEventListener('error', (e) => {
        console.error(`Error loading audio file ${file.name}:`, e);
      });

      localFiles.push(newFile);
    } catch (error) {
      console.error(`Error loading file ${file.name}:`, error);
    }
  }
}

export async function addLocalFile(file: File): Promise<LocalFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const audio = new Audio();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) {
        reject(new Error('Failed to read file'));
        return;
      }

      audio.src = result as string;
      audio.onloadedmetadata = () => {
        const newFile: LocalFile = {
          id: generateId(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Local File',
          thumbnail: '/images/music-placeholder.png',
          duration: formatDuration(audio.duration),
          source: 'local' as const,
          path: URL.createObjectURL(file),
        };

        localFiles.push(newFile);
        resolve(newFile);
      };

      audio.onerror = () => {
        reject(new Error('Failed to load audio metadata'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function searchLocalFiles(query: string): MusicTrack[] {
  const searchTerm = query.toLowerCase();
  return localFiles.filter(
    file => file.title.toLowerCase().includes(searchTerm)
  );
}

export function removeLocalFile(id: string): void {
  const index = localFiles.findIndex(file => file.id === id);
  if (index !== -1) {
    if (localFiles[index].path.startsWith('blob:')) {
      URL.revokeObjectURL(localFiles[index].path);
    }
    localFiles.splice(index, 1);
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 