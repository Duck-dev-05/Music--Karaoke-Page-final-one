import { promises as fs } from 'fs';
import path from 'path';

async function setupCovers() {
  const musicDir = path.join(process.cwd(), 'public', 'Music');
  const coversDir = path.join(musicDir, 'covers');

  // Create covers directory if it doesn't exist
  try {
    await fs.access(coversDir);
  } catch {
    await fs.mkdir(coversDir, { recursive: true });
  }

  // Create default cover images if they don't exist
  const defaultCovers = {
    'default-music.jpg': 'https://placehold.co/400x400/1e293b/ffffff?text=Music',
    'default-pop.jpg': 'https://placehold.co/400x400/ec4899/ffffff?text=Pop',
    'default-rock.jpg': 'https://placehold.co/400x400/f43f5e/ffffff?text=Rock',
    'default-jazz.jpg': 'https://placehold.co/400x400/8b5cf6/ffffff?text=Jazz',
    'default-classical.jpg': 'https://placehold.co/400x400/6366f1/ffffff?text=Classical',
    'default-electronic.jpg': 'https://placehold.co/400x400/06b6d4/ffffff?text=Electronic',
  };

  for (const [filename, imageUrl] of Object.entries(defaultCovers)) {
    const filePath = path.join(coversDir, filename);
    try {
      await fs.access(filePath);
      console.log(`${filename} already exists`);
    } catch {
      console.log(`Creating ${filename}...`);
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));
    }
  }

  console.log('Cover images setup complete!');
}

setupCovers().catch(console.error); 