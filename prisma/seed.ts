import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Ensure the free test user exists
  const user = await prisma.user.upsert({
    where: { email: 'free@test.com' },
    update: {},
    create: {
      email: 'free@test.com',
      name: 'Free Test',
      password: 'test123', // or hash if needed
      premium: false,
    },
  });

  // 2. Ensure songs exist
  const songsData = [
    {
      title: 'Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix',
      artist: 'Độ Mixi',
      videoId: 'local-1',
      thumbnailUrl: '/images/songs/default-cover.jpg',
      lyrics: null,
      hasKaraoke: true,
      isPremium: false,
    },
    {
      title: 'Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126',
      artist: 'Đan Nguyên, Bằng Kiều, Quang Lê',
      videoId: 'local-2',
      thumbnailUrl: '/images/songs/default-cover.jpg',
      lyrics: null,
      hasKaraoke: true,
      isPremium: false,
    },
    {
      title: 'mùa xuân ARIRANG karaoke',
      artist: 'ARIRANG',
      videoId: 'local-3',
      thumbnailUrl: '/images/songs/default-cover.jpg',
      lyrics: null,
      hasKaraoke: true,
      isPremium: false,
    },
  ];

  const songs = [];
  for (const songData of songsData) {
    const song = await prisma.song.upsert({
      where: { videoId: songData.videoId },
      update: {},
      create: songData,
    });
    songs.push(song);
  }

  // 3. Create a playlist for the user
  const playlist = await prisma.playlist.create({
    data: {
      name: 'Free Test Playlist',
      description: 'A playlist for the free test account',
      userId: user.id,
      songs: {
        create: songs.map((song, idx) => ({
          songId: song.id,
          order: idx,
        })),
      },
    },
  });

  console.log('Created playlist:', playlist);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 