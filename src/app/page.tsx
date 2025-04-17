'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MicrophoneIcon,
  MusicalNoteIcon as MusicIcon,
  HeartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { HomePremiumFeatures } from "@/components/HomePremiumFeatures";
import { FeaturedCollections } from "@/components/FeaturedCollections";

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMusicData() {
      try {
        const response = await fetch('/api/music');
        const data = await response.json();
        if (data.success) {
          setCollections(data.collections);
        }
      } catch (error) {
        console.error('Error fetching music data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMusicData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
            Your Ultimate Karaoke Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sing your heart out with our extensive collection of songs. 
            Create, share, and enjoy music like never before.
          </p>
          <div className="flex gap-4 justify-center">
            {session ? (
              <>
            <Button 
              size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => router.push('/songs')}
            >
              <MusicIcon className="w-5 h-5 mr-2" />
              Browse Music
            </Button>
            <Button
              size="lg" 
              variant="outline"
                  onClick={() => router.push('/karaoke')}
            >
              <MicrophoneIcon className="w-5 h-5 mr-2" />
              Sing Karaoke
            </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => router.push('/login')}
                >
                  Get Started
                </Button>
                <Button
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push('/songs')}
                >
                  <MusicIcon className="w-5 h-5 mr-2" />
                  Preview Songs
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MicrophoneIcon className="w-8 h-8 text-primary mb-4" />,
                title: "Karaoke Mode",
                description: "Sing along with synchronized lyrics and adjustable music tracks"
              },
              {
                icon: <MusicIcon className="w-8 h-8 text-primary mb-4" />,
                title: "Multiple Sources",
                description: "Access songs from YouTube, Spotify, and more"
              },
              {
                icon: <HeartIcon className="w-8 h-8 text-primary mb-4" />,
                title: "Create Playlists",
                description: "Organize your favorite songs into custom playlists"
              },
              {
                icon: <UserGroupIcon className="w-8 h-8 text-primary mb-4" />,
                title: "Social Features",
                description: "Share your performances and connect with others"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-card/50">
              <CardHeader>
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <HomePremiumFeatures />

      {/* Featured Collections */}
      <FeaturedCollections collections={collections} isLoading={isLoading} />

      {/* Footer */}
      <footer className="bg-background/95 border-t border-border/50 mt-auto">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                <li><Button variant="link" onClick={() => router.push('/')}>Home</Button></li>
                {session ? (
                  <>
                    <li><Button variant="link" onClick={() => router.push('/premium')}>Premium</Button></li>
                    <li><Button variant="link" onClick={() => router.push('/profile')}>Profile</Button></li>
                  </>
                ) : (
                  <>
                    <li><Button variant="link" onClick={() => router.push('/login')}>Login</Button></li>
                    <li><Button variant="link" onClick={() => router.push('/register')}>Register</Button></li>
                  </>
                )}
                <li><Button variant="link" onClick={() => router.push('/songs')}>Songs</Button></li>
                <li><Button variant="link" onClick={() => router.push('/support')}>Support</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe for updates about new features and releases.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
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