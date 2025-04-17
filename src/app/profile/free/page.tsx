"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Music, 
  Heart, 
  PlayCircle,
  LogOut,
  History,
  MapPin,
  Link as LinkIcon,
  AlertCircle,
  CalendarDays,
  Settings,
  UserCircle,
  ChevronRight,
  Lock,
  Crown
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

// Types
interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  premium: boolean;
  isTestAccount?: boolean;
  createdAt: string;
  updatedAt: string;
  total_favorites: number;
  total_playlists: number;
  total_songs?: number;
}

interface Activity {
  id: string;
  type: string;
  createdAt: string;
  song?: {
    id: string;
    title: string;
    artist: string;
    thumbnailUrl: string;
  };
  playlist?: {
    id: string;
    name: string;
    songCount: number;
  };
}

interface Favorite {
  id: string;
  song: {
    id: string;
    title: string;
    artist: string;
    thumbnailUrl: string;
    duration: number;
  };
  createdAt: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  songCount: number;
  previewImages: string[];
  createdAt: string;
  updatedAt: string;
}

export default function FreeUserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Loading states
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/profile?userId=${session.user.id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
      
      // Redirect premium users to their profile page
      if (data.premium) {
        router.replace('/profile/premium');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, router]);

  const fetchActivities = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingActivities(true);
      const response = await fetch(`/api/users/activities?userId=${session.user.id}&limit=10`);
      
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Activities fetch error:', err);
      toast.error('Failed to load activities');
    } finally {
      setLoadingActivities(false);
    }
  }, [session?.user?.id]);

  const fetchFavorites = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingFavorites(true);
      const response = await fetch(`/api/users/favorites?userId=${session.user.id}&limit=10`);
      
      if (!response.ok) throw new Error('Failed to fetch favorites');

      const data = await response.json();
      setFavorites(data.favorites);
    } catch (err) {
      console.error('Favorites fetch error:', err);
      toast.error('Failed to load favorites');
    } finally {
      setLoadingFavorites(false);
    }
  }, [session?.user?.id]);

  const fetchPlaylists = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingPlaylists(true);
      const response = await fetch(`/api/users/playlists?userId=${session.user.id}&limit=10`);
      
      if (!response.ok) throw new Error('Failed to fetch playlists');

      const data = await response.json();
      setPlaylists(data.playlists);
    } catch (err) {
      console.error('Playlists fetch error:', err);
      toast.error('Failed to load playlists');
    } finally {
      setLoadingPlaylists(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfileData();
      fetchActivities();
    }
  }, [status, router, fetchProfileData, fetchActivities]);

  useEffect(() => {
    if (activeTab === 'favorites' && favorites.length === 0 && !loadingFavorites) {
      fetchFavorites();
    } else if (activeTab === 'playlists' && playlists.length === 0 && !loadingPlaylists) {
      fetchPlaylists();
    }
  }, [activeTab, favorites.length, playlists.length, loadingFavorites, loadingPlaylists, fetchFavorites, fetchPlaylists]);

  const renderProfileHeader = () => {
    if (!profileData) return null;

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage 
                src={session?.user?.image || "/images/default-avatar.png"}
                alt={profileData.name || "User"}
              />
              <AvatarFallback>
                <UserCircle className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold">{profileData.name || 'Anonymous User'}</h2>
              <p className="text-muted-foreground">{profileData.email}</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full">
              <User className="h-4 w-4" />
              <span className="text-sm">Free Account</span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <Button onClick={() => router.push('/profile/edit')} className="w-full">
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/premium')}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderProfileDetails = () => {
    if (!profileData) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.bio && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Bio</p>
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
            </div>
          )}
          
          {profileData.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{profileData.location}</p>
            </div>
          )}
          
          {profileData.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <a 
                href={profileData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {profileData.website}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              Joined {formatDistanceToNow(new Date(profileData.createdAt), { addSuffix: true })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    if (!profileData) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Heart className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{profileData.total_favorites}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-xs text-muted-foreground mt-1">(Max: 10)</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <Music className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{profileData.total_playlists}</p>
              <p className="text-sm text-muted-foreground">Playlists</p>
              <p className="text-xs text-muted-foreground mt-1">(Max: 3)</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <PlayCircle className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold">{profileData.total_songs || 0}</p>
              <p className="text-sm text-muted-foreground">Songs</p>
              <p className="text-xs text-muted-foreground mt-1">(Max: 5)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFreeLimitations = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Account Limitations</CardTitle>
          <CardDescription>
            Upgrade to premium for unlimited access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Limited Favorites</h3>
                <p className="text-sm text-muted-foreground">
                  You can save up to 10 favorite songs with your free account.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Limited Playlists</h3>
                <p className="text-sm text-muted-foreground">
                  Create up to 3 playlists with your free account.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Basic Features</h3>
                <p className="text-sm text-muted-foreground">
                  Access to standard karaoke features only.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Standard Support</h3>
                <p className="text-sm text-muted-foreground">
                  Regular support response times.
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={() => router.push('/premium')}
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActivities = () => {
    if (loadingActivities) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              Your recent activities will appear here
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {activity.type === 'favorite' && (
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                )}
                {activity.type === 'playlist' && (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Music className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                {activity.type === 'play' && (
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
                
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.type === 'favorite' && 'Added to favorites'}
                    {activity.type === 'playlist' && 'Created a playlist'}
                    {activity.type === 'play' && 'Played a song'}
                  </p>
                  
                  {activity.song && (
                    <p className="text-sm text-muted-foreground">
                      {activity.song.title} by {activity.song.artist}
                    </p>
                  )}
                  
                  {activity.playlist && (
                    <p className="text-sm text-muted-foreground">
                      {activity.playlist.name} ({activity.playlist.songCount} songs)
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderFavorites = () => {
    if (loadingFavorites) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Favorites Yet</h3>
            <p className="text-sm text-muted-foreground">
              Songs you favorite will appear here
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                  <img 
                    src={favorite.song.thumbnailUrl} 
                    alt={favorite.song.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{favorite.song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {favorite.song.artist}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added {formatDistanceToNow(new Date(favorite.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPlaylists = () => {
    if (loadingPlaylists) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (playlists.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Playlists Yet</h3>
            <p className="text-sm text-muted-foreground">
              Playlists you create will appear here
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                  {playlist.previewImages.length > 0 ? (
                    <img 
                      src={playlist.previewImages[0]} 
                      alt={playlist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Music className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium truncate">{playlist.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {playlist.songCount} songs
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container max-w-5xl py-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium">Error Loading Profile</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              className="mt-4"
              onClick={() => fetchProfileData()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {renderProfileHeader()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          {renderProfileDetails()}
          {renderStats()}
          {renderFreeLimitations()}
        </TabsContent>
        
        <TabsContent value="activities">
          {renderActivities()}
        </TabsContent>
        
        <TabsContent value="favorites">
          {renderFavorites()}
        </TabsContent>
        
        <TabsContent value="playlists">
          {renderPlaylists()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 