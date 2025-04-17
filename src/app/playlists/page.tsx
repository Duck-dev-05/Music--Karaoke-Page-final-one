"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PlayCircle,
  PauseCircle,
  Volume,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Lock,
  Trash,
  Plus,
  Loader,
  Music,
  DollarSign,
  Music4,
  Settings,
  Clock,
  ChevronDown,
  ChevronUp,
  Waveform,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  createdAt: string;
  isPrivate?: boolean;
  isRecent?: boolean;
  isVietnamese?: boolean;
  isRemix?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const MAX_FREE_PLAYLISTS = 3;

const actualSongs: Song[] = [
  {
    id: "1",
    title: "Trường Sơn Đông Trường Sơn Tây Remix",
    artist: "Độ Mixi",
    duration: "4:10",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix.mp3"
  },
  {
    id: "2",
    title: "Đắp Mộ Cuộc Tình",
    artist: "Đan Nguyên, Bằng Kiều, Quang Lê",
    duration: "6:30",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126.mp3"
  },
  {
    id: "3",
    title: "Mùa Xuân",
    artist: "ARIRANG",
    duration: "3:36",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - mùa xuân ARIRANG karaoke.mp3"
  },
  {
    id: "4",
    title: "Way Back Home",
    artist: "SHAUN ft. Various Artists",
    duration: "4:10",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Way Back Home Về Nhà Thôi  SHAUN ft 20 Nghệ Sĩ Việt Nam  Gala Nhạc Việt Official MV.mp3"
  },
  {
    id: "5",
    title: "Sẽ Không Còn Nữa",
    artist: "Tuấn Hưng",
    duration: "4:50",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Sẽ Không Còn Nữa  Tuấn Hưng.mp3"
  },
  {
    id: "6",
    title: "Stream Đến Bao Giờ",
    artist: "Độ Mixi",
    duration: "3:10",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - STREAM ĐẾN BAO GIỜ  ĐỘ MIXI ft BẠN SÁNG TÁC OFFICIAL LYRICS VIDEO.mp3"
  },
  {
    id: "7",
    title: "Ông Trời Làm Tội Anh Chưa",
    artist: "RASTZ",
    duration: "5:59",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - RASTZ  ÔNG TRỜI LÀM TỘI ANH CHƯA  MINH HANH x QNT ft TUẤN CRY INSTRUMENTAL.mp3"
  },
  {
    id: "8",
    title: "Nắm",
    artist: "Hương Ly",
    duration: "4:30",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - NẮM  HƯƠNG LY  LIVE VERSION.mp3"
  },
  {
    id: "9",
    title: "Người Tình Mùa Đông",
    artist: "Như Quỳnh",
    duration: "4:00",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Người Tình Mùa Đông  Như Quỳnh ASIA 6.mp3"
  },
  {
    id: "10",
    title: "Tìm Lại Bầu Trời",
    artist: "Tuấn Hưng",
    duration: "5:36",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - NEU CONCERT 2022 TÌM LẠI BẦU TRỜI  TUẤN HƯNG.mp3"
  },
  {
    id: "11",
    title: "Chiếc Đèn Ông Sao",
    artist: "Phúc Wind",
    duration: "4:30",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/y2mate.com - Chiếc Đèn Ông SaoPhúc Wind Remix Official Audio Lyrics Video.mp3"
  },
  {
    id: "12",
    title: "Ngày Xuân Vui Cưới",
    artist: "Hoài Linh",
    duration: "8:54",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/VAN SON  Ngày Xuân Vui Cưới  Hoài Linh.mp3"
  },
  {
    id: "13",
    title: "UEFA Champions League Anthem",
    artist: "UEFA",
    duration: "2:48",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/UEFA Champions League Anthem Full Version.mp3"
  },
  {
    id: "14",
    title: "Tru Mua",
    artist: "Umie (RiverDLove Remix)",
    duration: "3:36",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Tru Mua - Umie (RiverDLove Remix) (RE-UP).mp3"
  },
  {
    id: "15",
    title: "Super Sentai 45th Anniversary Hero Getter",
    artist: "Various Artists",
    duration: "5:42",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Super Sentai 45th Anniversary Hero Getter.mp3"
  },
  {
    id: "16",
    title: "Ngày Xưa Ơi",
    artist: "Bảo Trâm, Mây Saigon",
    duration: "4:00",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Ngày Xưa Ơi  Bảo Trâm  Mây Saigon.mp3"
  },
  {
    id: "17",
    title: "Mùa Yêu",
    artist: "The Wall Nutszz",
    duration: "4:18",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Mùa Yêu  The Wall Nutszz Official Music Video.mp3"
  },
  {
    id: "18",
    title: "Mocha",
    artist: "The Wall Nutszz",
    duration: "5:24",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Mocha Lyrics Video  The Wall Nutszz.mp3"
  },
  {
    id: "19",
    title: "Mashup Tôi Người Việt Nam x Quê Hương Việt Nam",
    artist: "Nhóm Xuân Hạ Thu Đông",
    duration: "4:48",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Mashup Tôi Người Việt Nam x Quê Hương Việt Nam  Nhóm Xuân Hạ Thu Đông hòa giọng cảm xúc.mp3"
  },
  {
    id: "20",
    title: "Khát Vọng Tuổi Trẻ",
    artist: "Phương Mỹ Chi & Hoàng Dũng",
    duration: "3:18",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/KHÁT VỌNG TUỔI TRẺ  ---  Phương Mỹ Chi & Hoàng Dũng  Chung kết Đường lên đỉnh Olympia năm thứ 24.mp3"
  },
  {
    id: "21",
    title: "Gánh Mẹ",
    artist: "Unknown Artist",
    duration: "5:06",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Gánh Mẹ.mp3"
  },
  {
    id: "22",
    title: "Gokaiger Opening",
    artist: "Super Sentai",
    duration: "3:36",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/Gokaiger opening.mp3"
  },
  {
    id: "23",
    title: "FAI Songs",
    artist: "Various Artists",
    duration: "3:18",
    coverUrl: "/images/songs/default-cover.jpg",
    audioUrl: "/Music/FAI Songs _0_1731678983417.mp3"
  }
];

// Update initial playlists to match the UI categories
const initialPlaylists = {
  premium: [
    {
      id: "recent",
      name: "Recent Additions",
      description: "Recently added songs to your library",
      songs: actualSongs.slice(-6), // Last 6 songs added
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: false,
      isRecent: true
    },
    {
      id: "vietnamese",
      name: "Vietnamese Songs",
      description: "Collection of Vietnamese music",
      songs: actualSongs.filter(song => 
        song.artist.includes("Tuấn Hưng") || 
        song.artist.includes("Độ Mixi") ||
        song.artist.includes("Như Quỳnh") ||
        song.artist.includes("Hoài Linh") ||
        song.artist.includes("Hương Ly") ||
        song.artist.includes("Phương Mỹ Chi") ||
        song.title.includes("Việt Nam")
      ),
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: false,
      isVietnamese: true
    },
    {
      id: "remix",
      name: "Remixes",
      description: "Remixed and electronic versions",
      songs: actualSongs.filter(song => 
        song.title.toLowerCase().includes("remix") ||
        song.artist.toLowerCase().includes("remix")
      ),
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: false,
      isRemix: true
    },
    {
      id: "all",
      name: "All Songs",
      description: "Complete music collection",
      songs: actualSongs,
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: false
    }
  ],
  free: [
    {
      id: "free-recent",
      name: "Recent Additions",
      description: "Recently added songs to your library",
      songs: actualSongs.slice(-2), // Last 2 songs for free users
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: "free-vietnamese",
      name: "Vietnamese Songs",
      description: "Collection of Vietnamese music",
      songs: actualSongs.filter(song => 
        song.artist.includes("Tuấn Hưng") || 
        song.artist.includes("Độ Mixi")
      ).slice(0, 2), // First 2 Vietnamese songs for free users
      createdAt: new Date().toISOString().split('T')[0]
    }
  ],
  preview: [
    {
      id: "preview-recent",
      name: "Recent Additions",
      description: "Recently added songs to your library",
      songs: actualSongs.slice(-3), // Last 3 songs for preview
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: "preview-vietnamese",
      name: "Vietnamese Songs",
      description: "Collection of Vietnamese music",
      songs: actualSongs.filter(song => 
        song.title.includes("Việt Nam") || 
        song.artist.includes("Việt")
      ).slice(0, 3), // First 3 Vietnamese songs for preview
      createdAt: new Date().toISOString().split('T')[0]
    }
  ]
};

// Add after the categories array
const PremiumAlert = () => {
  const router = useRouter();
  
  return (
    <Alert className="mb-6">
      <AlertTitle className="flex items-center gap-2">
        <Crown className="h-4 w-4" />
        Upgrade to Premium
      </AlertTitle>
      <AlertDescription className="mt-2 flex justify-between items-center">
        <span>Get unlimited access to all songs and features.</span>
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push('/premium')}
          className="ml-4"
        >
          <Crown className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default function PlaylistsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [crossfadeTime, setCrossfadeTime] = useState(0);
  const [audioQuality, setAudioQuality] = useState<'normal' | 'high'>('normal');
  const [showQualityBadge, setShowQualityBadge] = useState(false);
  const previousAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [hasLoadedMetadata, setHasLoadedMetadata] = useState(false);
  const [originalDuration, setOriginalDuration] = useState<{[key: string]: number}>({});
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();
  const progressTimeoutRef = useRef<NodeJS.Timeout>();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [visualizer, setVisualizer] = useState<'none' | 'bars' | 'wave'>('none');
  const [equalizer, setEqualizer] = useState({
    bass: 0,
    mid: 0,
    treble: 0
  });
  const pathname = usePathname();
  const category = pathname.split("/")[2] || "all";

  const isPremium = session?.user?.email === "premium@test.com";
  const isFreeUser = session?.user?.email === "free@test.com";

  const categories = [
    { id: "all", label: "All Songs" },
    { id: "recent", label: "Recent" },
    { id: "vietnamese", label: "Vietnamese" },
    { id: "remix", label: "Remix" }
  ];

  const currentCategory = pathname.split("/")[2] || "all";

  // Filter playlists based on category
  const filteredPlaylists = playlists.filter(playlist => {
    if (currentCategory === "all") return true;
    if (currentCategory === "recent") return playlist.isRecent;
    if (currentCategory === "vietnamese") return playlist.isVietnamese;
    if (currentCategory === "remix") return playlist.isRemix;
    return true;
  });

  useEffect(() => {
    if (status === 'loading') return;

    // Show notification for non-authenticated users
    if (!session?.user) {
      toast.info("Please sign in to view playlists", {
        description: "Create an account or sign in to access your playlists",
        duration: 5000,
        action: {
          label: "Sign In",
          onClick: () => router.push('/login')
        }
      });
      return;
    }

    // Load playlists based on user status
    setIsLoading(true);
    setTimeout(() => {
      if (isPremium) {
        setPlaylists(initialPlaylists.premium);
        toast.success("Welcome to your premium playlists!");
      } else if (isFreeUser) {
        setPlaylists(initialPlaylists.free);
        toast.success("Welcome to your playlists (Free Account: 3 max)");
      }
      setIsLoading(false);
    }, 1000);
  }, [session, status, isPremium, isFreeUser, router]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleRemovePlaylist = (id: string) => {
    if (!session?.user) {
      handleLoginRedirect();
      return;
    }
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    toast.success("Playlist removed");
  };

  // Prevent auto-reload and handle audio loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    const handleLoadStart = () => {
      setIsLoadingAudio(true);
      setHasLoadedMetadata(false);
    };

    const handleLoadedMetadata = () => {
      setIsLoadingAudio(false);
      setHasLoadedMetadata(true);
      if (audio.src) {
        setOriginalDuration(prev => ({
          ...prev,
          [audio.src]: audio.duration
        }));
      }
    };

    const handleError = (e: ErrorEvent) => {
      setIsLoadingAudio(false);
      console.error('Audio loading error:', e);
      toast.error('Error loading audio. Please try again.');
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError as EventListener);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [isPlaying]);

  // Modified handlePlaySong to preserve duration
  const handlePlaySong = async (e: React.MouseEvent, audioUrl: string, playlist: Playlist) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      handleLoginRedirect();
      return;
    }

    const songIndex = playlist.songs.findIndex(s => s.audioUrl === audioUrl);
    if (songIndex === -1) return;

    setCurrentPlaylist(playlist);
    setCurrentSongIndex(songIndex);

    if (audioRef.current) {
      try {
        if (currentlyPlaying === audioUrl) {
          if (audioRef.current.paused) {
            await audioRef.current.play();
            setIsPlaying(true);
          } else {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        } else {
          setIsLoadingAudio(true);
          audioRef.current.src = audioUrl;
          
          // Set initial duration from cached value if available
          if (originalDuration[audioUrl]) {
            setDuration(originalDuration[audioUrl]);
          }
          
          await audioRef.current.play();
          setCurrentlyPlaying(audioUrl);
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Playback error:', error);
        toast.error('Error playing audio. Please try again.');
        setIsLoadingAudio(false);
      }
    }
  };

  const handleCreatePlaylist = async (name: string, description: string) => {
    if (!session?.user) {
      handleLoginRedirect();
      return;
    }
    
    if (!isPremium && playlists.length >= MAX_FREE_PLAYLISTS) {
      toast.error(`Free accounts are limited to ${MAX_FREE_PLAYLISTS} playlists. Upgrade to Premium for unlimited playlists!`);
      return;
    }
    
    // Mock creating a new playlist
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    toast.success("Playlist created successfully");
    setIsCreateModalOpen(false);
  };

  // Debounced time update to prevent excessive re-renders
  const debouncedTimeUpdate = useCallback((time: number) => {
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
    }
    progressTimeoutRef.current = setTimeout(() => {
      setCurrentTime(time);
    }, 50);
  }, []);

  // Smooth volume control
  const handleVolumeHover = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  // Enhanced time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) {
        debouncedTimeUpdate(audio.currentTime);
      }
      // Use original duration if available, otherwise use audio.duration
      if (audio.src && originalDuration[audio.src]) {
        setDuration(originalDuration[audio.src]);
      } else {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
    };
  }, [isDragging, debouncedTimeUpdate]);

  // Smooth time seeking
  const handleTimeChange = useCallback((value: number[]) => {
    setIsDragging(true);
    setCurrentTime(value[0]);
  }, []);

  const handleTimeChangeEnd = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
    setIsDragging(false);
  }, []);

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const findCurrentSongInfo = () => {
    for (const playlist of playlists) {
      const songIndex = playlist.songs.findIndex(s => s.audioUrl === currentlyPlaying);
      if (songIndex !== -1) {
        return { playlist, songIndex };
      }
    }
    return null;
  };

  const playNextSong = () => {
    const info = findCurrentSongInfo();
    if (!info) return;

    const { playlist, songIndex } = info;
    let nextIndex;

    if (isShuffling) {
      // Play random song from playlist excluding current song
      const availableIndices = Array.from(
        { length: playlist.songs.length },
        (_, i) => i
      ).filter(i => i !== songIndex);
      
      if (availableIndices.length === 0) return;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Play next song in sequence
      nextIndex = (songIndex + 1) % playlist.songs.length;
    }

    const nextSong = playlist.songs[nextIndex];
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = nextSong.audioUrl;
      audioRef.current.play().catch(console.error);
      setCurrentlyPlaying(nextSong.audioUrl);
    }
  };

  const playPreviousSong = () => {
    const info = findCurrentSongInfo();
    if (!info) return;

    const { playlist, songIndex } = info;
    const previousIndex = songIndex === 0 ? playlist.songs.length - 1 : songIndex - 1;
    const previousSong = playlist.songs[previousIndex];
    
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(previousIndex);
    if (audioRef.current) {
      audioRef.current.src = previousSong.audioUrl;
      audioRef.current.play().catch(console.error);
      setCurrentlyPlaying(previousSong.audioUrl);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    toast.success(isShuffling ? "Shuffle disabled" : "Shuffle enabled");
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = previousVolume;
        setVolume(previousVolume);
      } else {
        setPreviousVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  // Add auto-play next song when current song ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleSongEnd = () => {
      if (!isLooping) {
        playNextSong();
      }
    };

    audio.addEventListener('ended', handleSongEnd);
    return () => audio.removeEventListener('ended', handleSongEnd);
  }, [isLooping, currentPlaylist, currentSongIndex]);

  const getCurrentSong = () => {
    for (const playlist of playlists) {
      const song = playlist.songs.find(s => s.audioUrl === currentlyPlaying);
      if (song) return song;
    }
    return null;
  };

  // Add crossfade effect for premium users
  useEffect(() => {
    if (!isPremium || crossfadeTime === 0) return;

    const audio = audioRef.current;
    const previousAudio = previousAudioRef.current;
    if (!audio || !previousAudio) return;

    const handleTimeUpdate = () => {
      if (audio.duration && audio.currentTime > 0) {
        const timeLeft = audio.duration - audio.currentTime;
        if (timeLeft <= crossfadeTime) {
          const nextInfo = findCurrentSongInfo();
          if (nextInfo) {
            const nextSong = nextInfo.playlist.songs[(nextInfo.songIndex + 1) % nextInfo.playlist.songs.length];
            if (nextSong) {
              previousAudio.src = nextSong.audioUrl;
              previousAudio.volume = 0;
              previousAudio.play().then(() => {
                const fadeInterval = setInterval(() => {
                  if (audio.volume > 0.1) {
                    audio.volume -= 0.1;
                    previousAudio.volume += 0.1;
                  } else {
                    clearInterval(fadeInterval);
                    audio.pause();
                    setCurrentlyPlaying(nextSong.audioUrl);
                    [audioRef.current, previousAudioRef.current] = [previousAudioRef.current, audioRef.current];
                  }
                }, (crossfadeTime * 100));
              }).catch(console.error);
            }
          }
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPremium, crossfadeTime, currentPlaylist, currentSongIndex]);

  // Add audio quality control for premium users
  useEffect(() => {
    if (!isPremium) return;
    
    const showQuality = () => setShowQualityBadge(true);
    const hideQuality = () => setShowQualityBadge(false);
    
    if (audioQuality === 'high') {
      showQuality();
      const timer = setTimeout(hideQuality, 3000);
      return () => clearTimeout(timer);
    }
  }, [audioQuality, isPremium]);

  const toggleAudioQuality = () => {
    if (!isPremium) {
      toast.error("Audio quality control is a premium feature");
      return;
    }
    setAudioQuality(current => {
      const newQuality = current === 'normal' ? 'high' : 'normal';
      toast.success(`Audio quality set to ${newQuality}`);
      return newQuality;
    });
  };

  const handleCrossfadeChange = (value: number[]) => {
    if (!isPremium) {
      toast.error("Crossfade control is a premium feature");
      return;
    }
    setCrossfadeTime(value[0]);
    toast.success(`Crossfade set to ${value[0]} seconds`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Please sign in</h1>
        <p className="text-muted-foreground">
          You need to be signed in to view playlists
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-secondary-foreground"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Show premium alert for free users */}
      {isFreeUser && <PremiumAlert />}

      {/* Category Navigation */}
      <nav className="flex gap-4 mb-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/playlists/${category.id}`}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors",
              currentCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map((playlist) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{playlist.name}</CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                  </div>
                  {session?.user && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemovePlaylist(playlist.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playlist.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer group"
                      onClick={(e) => handlePlaySong(e, song.audioUrl, playlist)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                          {currentlyPlaying === song.audioUrl ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              {isPlaying ? (
                                <span className="block w-2 h-2 bg-primary rounded-full animate-ping" />
                              ) : (
                                <PlayCircle className="h-6 w-6 text-primary" />
                              )}
                            </div>
                          ) : (
                            <PlayCircle className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-1">{song.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {song.artist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {song.duration}
                        </span>
                        <Music4 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AnimatePresence>
        {currentlyPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50",
              isMinimized ? "h-16" : "h-auto"
            )}
          >
            <div className="container max-w-7xl mx-auto px-4 py-2">
              <div className={cn(
                "grid gap-4",
                isMinimized 
                  ? "grid-cols-[auto_1fr_auto] items-center" 
                  : "grid-cols-[1fr_2fr_1fr] items-center"
              )}>
                {/* Compact Song Info */}
                <motion.div layout className="flex items-center gap-2 min-w-0 max-w-[300px]">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0"
                  >
                    {isLoadingAudio ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full"
                      />
                    ) : (
                      <Music4 className="h-5 w-5 text-primary" />
                    )}
                  </motion.div>
                  {(!isMinimized || isMinimized) && (
                    <div className="min-w-0 flex-1">
                      <motion.h4 layout className="font-medium truncate text-sm">
                        {getCurrentSong()?.title || 'Unknown'}
                      </motion.h4>
                      <motion.p layout className="text-xs text-muted-foreground truncate">
                        {getCurrentSong()?.artist || 'Unknown'}
                      </motion.p>
                    </div>
                  )}
                </motion.div>

                {/* Compact Controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn("hover:text-primary transition-colors", isShuffling && "text-primary")}
                              onClick={toggleShuffle}
                            >
                              <Shuffle className={cn("h-5 w-5", isShuffling && "text-primary")} />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>Shuffle</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={playPreviousSong}
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          if (audioRef.current) {
                            if (isPlaying) {
                              audioRef.current.pause();
                            } else {
                              audioRef.current.play();
                            }
                          }
                        }}
                      >
                        {isPlaying ? (
                          <PauseCircle className="h-8 w-8" />
                        ) : (
                          <PlayCircle className="h-8 w-8" />
                        )}
                      </Button>
                    </motion.div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={playNextSong}
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn("hover:text-primary", isLooping && "text-primary")}
                            onClick={toggleLoop}
                          >
                            <Repeat className={cn("h-5 w-5", isLooping && "text-primary")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Repeat</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {!isMinimized && (
                    <div className="flex items-center gap-2 w-full px-2">
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {formatTime(currentTime)}
                      </span>
                      <div className="relative flex-1">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={0.1}
                          onValueChange={handleTimeChange}
                          onValueCommit={handleTimeChangeEnd}
                          className="flex-1"
                          disabled={isLoadingAudio || !hasLoadedMetadata}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {formatTime(duration)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end gap-2">
                  {isPremium && !isMinimized && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative">
                          <Settings className="h-4 w-4" />
                          {showQualityBadge && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full"
                            />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Premium Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={toggleAudioQuality}>
                          <Waveform className="h-4 w-4 mr-2" />
                          Audio Quality: {audioQuality}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          <div className="flex items-center gap-2 flex-1">
                            Crossfade: {crossfadeTime}s
                            <Slider
                              value={[crossfadeTime]}
                              max={12}
                              step={1}
                              onValueChange={handleCrossfadeChange}
                              className="w-20"
                            />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setVisualizer(v => v === 'none' ? 'bars' : v === 'bars' ? 'wave' : 'none')}>
                          <Waveform className="h-4 w-4 mr-2" />
                          Visualizer: {visualizer}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <motion.div 
                    className="flex items-center gap-1"
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-primary"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume className="h-5 w-5" />
                      )}
                    </Button>
                    <AnimatePresence>
                      {(showVolumeSlider && !isMinimized) && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 80, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-20"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMinimized(!isMinimized)}
                          className="hover:text-primary"
                        >
                          {isMinimized ? (
                            <motion.div animate={{ rotate: 180 }}>
                              <ChevronUp className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMinimized ? 'Expand' : 'Minimize'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 