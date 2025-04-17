import getAudioDuration from 'get-audio-duration';
import path from 'path';
import { readdir, stat } from 'fs/promises';

export interface AudioFile {
  name: string;
  duration: number;
  path: string;
  size: number;
}

export async function getMusicFiles(): Promise<AudioFile[]> {
  try {
    const musicDir = path.join(process.cwd(), 'public/Music');
    const files = await readdir(musicDir);
    const mp3Files = files.filter(file => file.endsWith('.mp3'));

    const audioFiles = await Promise.all(
      mp3Files.map(async (file) => {
        try {
          const filePath = path.join(musicDir, file);
          const stats = await stat(filePath);
          const duration = await getAudioDuration(filePath);

          return {
            name: file.replace('.mp3', ''),
            duration,
            path: `/Music/${file}`,
            size: stats.size
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
    );

    return audioFiles.filter((file): file is AudioFile => file !== null);
  } catch (error) {
    console.error('Error reading music directory:', error);
    return [];
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
} 