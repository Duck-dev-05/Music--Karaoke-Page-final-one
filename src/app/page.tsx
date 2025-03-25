'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MicrophoneIcon,
  MusicalNoteIcon as MusicIcon,
  HeartIcon,
  UserGroupIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlayIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

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

export default function HomePage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [recentMusic, setRecentMusic] = useState<MusicFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMusicData() {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.success) {
          setCollections(data.collections);
          setRecentMusic(data.recentMusic);
        } else {
          console.error('Data fetch was not successful:', data);
        }
      } catch (error) {
        console.error('Error fetching music data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMusicData();
  }, []);

  // Add navigation handlers
  const handleMusicClick = () => {
    router.push('/songs');
  };

  const handleKaraokeClick = () => {
    router.push('/karaoke');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      {/* Hero Section with smoother gradient and animation */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 animate-gradient-x">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary animate-text-shimmer">
            Your Ultimate Karaoke Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Sing your heart out with our extensive collection of songs from multiple sources. 
            Create, share, and enjoy music like never before.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
              onClick={handleMusicClick}
            >
              <MusicIcon className="w-5 h-5 mr-2" />
              Browse Music
            </Button>
            <Button
              size="lg" 
              variant="outline"
              className="transition-all duration-300 transform hover:scale-105"
              onClick={handleKaraokeClick}
            >
              <MicrophoneIcon className="w-5 h-5 mr-2" />
              Sing Karaoke
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with hover animations */}
      <section className="py-20 px-4 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <MicrophoneIcon className="w-8 h-8 text-primary mb-4 transform transition-transform group-hover:scale-110" />
                <CardTitle>Karaoke Mode</CardTitle>
                <CardDescription>
                  Sing along with synchronized lyrics and adjustable music tracks
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <MusicIcon className="w-8 h-8 text-primary mb-4 transform transition-transform group-hover:scale-110" />
                <CardTitle>Multiple Sources</CardTitle>
                <CardDescription>
                  Access songs from YouTube, Spotify, Mixcloud, and local files
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <HeartIcon className="w-8 h-8 text-primary mb-4 transform transition-transform group-hover:scale-110" />
                <CardTitle>Create Playlists</CardTitle>
                <CardDescription>
                  Organize your favorite songs into custom playlists
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <UserGroupIcon className="w-8 h-8 text-primary mb-4 transform transition-transform group-hover:scale-110" />
                <CardTitle>Social Features</CardTitle>
                <CardDescription>
                  Share your performances and connect with other music lovers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Music Section */}
      <section className="py-16 px-4 bg-background/40 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Featured Collections
            </h2>
            <Button variant="ghost" onClick={() => router.push('/playlists')} className="text-primary hover:text-primary/90">
              View All
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading collections...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/playlists/${collection.title.toLowerCase().replace(/ /g, '-')}`)}
                >
                  <CardHeader className="relative p-0">
                    <div className={`w-full aspect-square bg-gradient-to-br ${collection.gradient} rounded-t-lg p-6 flex flex-col justify-end`}>
                      <MusicIcon className="w-16 h-16 text-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                      <div className="relative z-10 text-white">
                        <p className="text-sm font-medium uppercase tracking-wider opacity-80">
                          {collection.category}
                        </p>
                        <h3 className="text-xl font-bold mt-1">{collection.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {collection.count} songs • {collection.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Recent Music</h3>
              <Button variant="ghost" onClick={() => router.push('/songs')} className="text-primary hover:text-primary/90">
                See All
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading recent music...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentMusic.map((song, index) => (
                  <Card 
                    key={index} 
                    className="group hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/songs/${encodeURIComponent(song.title)}`)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MusicIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{song.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{song.type}</span>
                          <span>•</span>
                          <span>{song.duration}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          const audio = new Audio(song.path);
                          audio.play();
                        }}
                      >
                        <PlayIcon className="w-5 h-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-background/95 backdrop-blur-sm border-t border-border/50 mt-auto">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-muted-foreground">
                Your ultimate destination for karaoke entertainment. 
                We bring together the best music from multiple platforms.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5" />
                  <a href="mailto:contact@karaoke.com" className="text-muted-foreground hover:text-primary transition-colors">
                    contact@karaoke.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <GlobeAltIcon className="w-5 h-5" />
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    www.karaoke.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to get updates about new features and releases.
              </p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Karaoke App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 