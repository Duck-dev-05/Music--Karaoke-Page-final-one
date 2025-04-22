import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data using actual music files
const mockHistory = [
  {
    id: '1',
    type: 'LISTEN',
    songId: '1',
    songTitle: 'Trường Sơn Đông Trường Sơn Tây Remix',
    artist: 'Độ Mixi',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix.mp3',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration: 245
  },
  {
    id: '2',
    type: 'KARAOKE',
    songId: '2',
    songTitle: 'Đắp Mộ Cuộc Tình',
    artist: 'Đan Nguyên, Bằng Kiều, Quang Lê',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126.mp3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    duration: 390
  },
  {
    id: '3',
    type: 'LISTEN',
    songId: '3',
    songTitle: 'Way Back Home',
    artist: 'SHAUN ft. Various Artists',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Way Back Home Về Nhà Thôi  SHAUN ft 20 Nghệ Sĩ Việt Nam  Gala Nhạc Việt Official MV.mp3',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    duration: 246
  },
  {
    id: '4',
    type: 'KARAOKE',
    songId: '4',
    songTitle: 'Sẽ Không Còn Nữa',
    artist: 'Tuấn Hưng',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - Sẽ Không Còn Nữa  Tuấn Hưng.mp3',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    duration: 294
  },
  {
    id: '5',
    type: 'LISTEN',
    songId: '5',
    songTitle: 'Stream Đến Bao Giờ',
    artist: 'Độ Mixi ft. Bạn Sáng Tác',
    thumbnailUrl: '/images/music-placeholder.png',
    audioUrl: '/Music/y2mate.com - STREAM ĐẾN BAO GIỜ  ĐỘ MIXI ft BẠN SÁNG TÁC OFFICIAL LYRICS VIDEO.mp3',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    duration: 186
  }
];

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Filter history based on type
    let filteredHistory = [...mockHistory];
    if (type && type !== 'all') {
      filteredHistory = mockHistory.filter(item => 
        item.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Apply limit
    filteredHistory = filteredHistory.slice(0, limit);

    return NextResponse.json(filteredHistory);
  } catch (error) {
    console.error('[HISTORY_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, songId, songTitle, artist, thumbnailUrl, audioUrl, duration } = body;

    // Validate required fields
    if (!type || !songId || !songTitle || !artist || !audioUrl) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // In a real application, you would save this to a database
    const newHistoryItem = {
      id: Date.now().toString(),
      type,
      songId,
      songTitle,
      artist,
      thumbnailUrl: thumbnailUrl || '/images/music-placeholder.png',
      audioUrl,
      duration,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(newHistoryItem);
  } catch (error) {
    console.error('[HISTORY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 