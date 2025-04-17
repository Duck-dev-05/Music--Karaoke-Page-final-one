"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Heart, 
  PlayCircle, 
  Trophy,
  Crown,
  Star,
  Clock,
  Mic2,
  Settings,
  Download,
  Share2,
  Users
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PremiumStats {
  songsPlayed: number;
  minutesListened: number;
  perfectScores: number;
  totalScore: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface Activity {
  id: string;
  songName: string;
  score: number;
  date: string;
  perfectScore: boolean;
}

interface Favorite {
  id: string;
  songName: string;
  artist: string;
  lastPlayed: string;
  difficulty: string;
}

interface Playlist {
  id: string;
  name: string;
  songCount: number;
  lastModified: string;
  isPublic: boolean;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

// Test account data
const TEST_ACCOUNT = {
  name: "Premium Test User",
  email: "premium@test.com",
  image: "/default-avatar.png",
  role: "premium",
  memberSince: "2024-03-15",
  stats: {
    songsPlayed: 150,
    minutesListened: 720,
    perfectScores: 25,
    totalScore: 12500,
    level: 8,
    xp: 7500,
    nextLevelXp: 10000
  },
  achievements: [
    { id: 1, title: "Perfect Score", description: "Get 100% on a song", icon: Trophy },
    { id: 2, title: "Rising Star", description: "Complete 50 songs", icon: Star },
    { id: 3, title: "Dedicated Singer", description: "Sing for 10 hours", icon: Mic2 }
  ],
  recentActivities: [
    { id: "1", songName: "Bohemian Rhapsody", score: 98, date: "2024-03-15", perfectScore: false },
    { id: "2", songName: "Sweet Child O' Mine", score: 95, date: "2024-03-14", perfectScore: false },
    { id: "3", songName: "Yesterday", score: 100, date: "2024-03-13", perfectScore: true }
  ],
  favorites: [
    { id: "1", songName: "Hotel California", artist: "Eagles", lastPlayed: "2024-03-15", difficulty: "Medium" },
    { id: "2", songName: "Stairway to Heaven", artist: "Led Zeppelin", lastPlayed: "2024-03-14", difficulty: "Hard" },
    { id: "3", songName: "Imagine", artist: "John Lennon", lastPlayed: "2024-03-13", difficulty: "Easy" }
  ],
  playlists: [
    { id: "1", name: "Rock Classics", songCount: 25, lastModified: "2024-03-15", isPublic: true },
    { id: "2", name: "Pop Hits", songCount: 30, lastModified: "2024-03-14", isPublic: false },
    { id: "3", name: "Practice List", songCount: 15, lastModified: "2024-03-13", isPublic: false }
  ]
};

export default function PremiumProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(TEST_ACCOUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      setLoading(false);
      // In a real app, you would fetch actual user data here
      setUserData(TEST_ACCOUNT);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-24 w-24 rounded-full bg-secondary" />
          <div className="h-8 w-48 bg-secondary rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const levelProgress = (userData.stats.xp / userData.stats.nextLevelXp) * 100;

  return (
    <div className="container mx-auto p-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={userData.image} />
            <AvatarFallback>{userData.name[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -top-2 -right-2">
            <Badge variant="premium" className="bg-gradient-to-r from-yellow-400 to-yellow-600">
              <Crown className="h-4 w-4 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{userData.name}</h1>
          <p className="text-muted-foreground">{userData.email}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Level {userData.stats.level}</Badge>
            <Badge variant="outline">Member since {userData.memberSince}</Badge>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {userData.stats.level}</span>
              <span>{userData.stats.xp} / {userData.stats.nextLevelXp} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Songs Played</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.stats.songsPlayed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Scores</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.stats.perfectScores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.stats.minutesListened}m</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.stats.totalScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Premium Features</CardTitle>
          <CardDescription>Exclusive features available to premium members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg h-auto"
              onClick={() => router.push('/profile/premium/offline')}
            >
              <Download className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Offline Mode</p>
                <p className="text-sm text-muted-foreground">Practice anywhere</p>
              </div>
            </Button>
            <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
              <Share2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Share Progress</p>
                <p className="text-sm text-muted-foreground">Connect with others</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Multiplayer</p>
                <p className="text-sm text-muted-foreground">Sing with friends</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.songName}</p>
                      <p className="text-sm text-muted-foreground">Played on {activity.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.perfectScore && (
                        <Badge variant="premium">
                          <Trophy className="h-3 w-3 mr-1" />
                          Perfect
                        </Badge>
                      )}
                      <span className="font-medium">{activity.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                    <achievement.icon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Songs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.favorites.map(favorite => (
                  <div key={favorite.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{favorite.songName}</p>
                      <p className="text-sm text-muted-foreground">
                        {favorite.artist} • {favorite.difficulty}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Practice
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists">
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.playlists.map(playlist => (
                  <div key={playlist.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{playlist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {playlist.songCount} songs • Last modified {playlist.lastModified}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      {playlist.isPublic ? (
                        <Badge>Public</Badge>
                      ) : (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}