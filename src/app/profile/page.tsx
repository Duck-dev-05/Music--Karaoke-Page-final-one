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
  Star,
  LogOut,
  History,
  MapPin,
  Link as LinkIcon,
  AlertCircle,
  CalendarDays,
  Settings,
  UserCircle,
  ChevronRight,
  Sparkles,
  Lock,
  CreditCard,
  Crown,
  Info,
  Clock,
  CircleUserRound,
  WifiIcon,
  PlaylistIcon,
  ListMusicIcon
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

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
  subscription?: {
    currentPeriodEnd: string;
  };
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

const PROFILE_FEATURES = [
  {
    title: "Offline Mode",
    description: "Download and listen offline",
    icon: WifiIcon,
    href: "/profile/premium/offline",
    premium: true
  },
  {
    title: "My Playlists",
    description: "View and manage playlists",
    icon: ListMusicIcon,
    href: "/profile/playlists",
    premium: false
  },
  {
    title: "Favorites",
    description: "Your favorite songs",
    icon: Heart,
    href: "/profile/favorites",
    premium: false
  },
  {
    title: "Recent Activity",
    description: "Your recent karaoke sessions",
    icon: Music,
    href: "/profile/activity",
    premium: false
  }
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
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
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

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

  const handleFeatureClick = (feature: typeof PROFILE_FEATURES[0]) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
        variant: "destructive"
      });
      router.push("/login");
      return;
    }

    // Allow direct navigation to offline mode
    if (feature.href === "/profile/premium/offline") {
      router.push(feature.href);
      return;
    }

    // Check premium requirement for other features
    if (feature.premium && !session.user.premium) {
      toast({
        title: "Premium Required",
        description: "Please upgrade to premium to access this feature",
        variant: "destructive"
      });
      router.push("/premium");
      return;
    }

    // If user is premium or feature doesn't require premium, navigate to the feature
    router.push(feature.href);
  };

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
                <CircleUserRound className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold">{profileData.name || 'Anonymous User'}</h2>
              <p className="text-muted-foreground">{profileData.email}</p>
            </div>

            {profileData.premium ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">Premium Member</span>
                <Sparkles className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full">
                <User className="h-4 w-4" />
                <span className="text-sm">Free Account</span>
              </div>
            )}

            <div className="w-full flex flex-col gap-2">
              <Button onClick={() => router.push('/profile/edit')} className="w-full">
                Edit Profile
              </Button>
              {!profileData.premium && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/premium')}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
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
            <div>
              <h3 className="text-sm font-medium mb-1">Bio</h3>
              <p className="text-sm text-muted-foreground">{profileData.bio}</p>
            </div>
          )}
          {profileData.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profileData.location}</span>
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm">
              Joined {format(new Date(profileData.createdAt), 'MMMM yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <History className="h-4 w-4" />
            <span className="text-sm">
              Last active {formatDistanceToNow(new Date(profileData.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    const premiumStats = [
      {
        label: "Favorite Songs",
        value: profileData?.total_favorites || "0",
        icon: Heart,
        href: "/favorites"
      },
      {
        label: "Playlists",
        value: profileData?.total_playlists || "0",
        icon: Music,
        href: "/playlists"
      },
      {
        label: "Karaoke Sessions",
        value: profileData?.total_songs || "0",
        icon: PlayCircle,
        href: "/karaoke"
      }
    ];

    const freeStats = [
      {
        label: "Favorite Songs",
        value: profileData?.total_favorites || "0",
        icon: Heart,
        href: "/favorites",
        limit: "5/5"
      },
      {
        label: "Playlists",
        value: profileData?.total_playlists || "0",
        icon: Music,
        href: "/playlists",
        limit: "2/2"
      },
      {
        label: "Karaoke Sessions",
        value: profileData?.total_songs || "0",
        icon: PlayCircle,
        href: "/karaoke",
        limit: "3/3"
      }
    ];

    const stats = profileData?.premium ? premiumStats : freeStats;

    return (
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full h-auto p-2 hover:bg-transparent"
                onClick={() => router.push(stat.href)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {!profileData?.premium && stat.limit && (
                      <Badge variant="outline" className="ml-2">
                        {stat.limit}
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPremiumFeatures = () => {
    if (!profileData?.premium) {
      return (
        <Card className="border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Premium Features
            </CardTitle>
            <CardDescription>Unlock all features with Premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Unlimited favorites</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Create unlimited playlists</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Ad-free karaoke experience</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Priority support</span>
              </div>
              <Button 
                onClick={() => router.push("/premium")}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              >
                <Star className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                  <div className="w-full space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
  return (
      <div className="container max-w-md mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Error Loading Profile</h2>
              <p className="text-red-500 mb-4">{error || 'Profile data not available'}</p>
              <Button
                onClick={fetchProfileData}
                className="w-full"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isTestAccount = profileData.isTestAccount;
  const isPremium = profileData.premium;

  return (
    <div className="container max-w-7xl py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Overview */}
        <div className="space-y-6">
          {renderProfileHeader()}
          {renderProfileDetails()}
          {renderStats()}
          {renderPremiumFeatures()}
                </div>

        {/* Right Column - Content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites
                {!isPremium && (
                  <Badge variant="outline" className="ml-2">5/5</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="playlists">
                Playlists
                {!isPremium && (
                  <Badge variant="outline" className="ml-2">2/2</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingActivities ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <div className="flex-1">
                            <p className="text-sm">
                              {activity.type === 'FAVORITE' && 'Favorited a song'}
                              {activity.type === 'PLAYLIST' && 'Created a playlist'}
                              {activity.type === 'KARAOKE' && 'Sang karaoke'}
                            </p>
                            {activity.song && (
                              <p className="text-xs text-muted-foreground">
                                {activity.song.title} - {activity.song.artist}
                              </p>
                            )}
                            {activity.playlist && (
                              <p className="text-xs text-muted-foreground">
                                {activity.playlist.name} ({activity.playlist.songCount} songs)
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No recent activity to show</p>
                  )}
                </CardContent>
              </Card>

              {isTestAccount && (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Info className="h-5 w-5" />
                      <p className="text-sm font-medium">This is a test account. Some features may be limited.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Songs</CardTitle>
                  <CardDescription>Songs you've marked as favorites</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingFavorites ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : favorites.length > 0 ? (
                    <div className="space-y-4">
                      {favorites.map((favorite) => (
                        <div 
                          key={favorite.id} 
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/songs/${favorite.song.id}`)}
                        >
                          <img 
                            src={favorite.song.thumbnailUrl || "/images/default-song.png"} 
                            alt={favorite.song.title}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{favorite.song.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{favorite.song.artist}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.floor(favorite.song.duration / 60)}:{String(favorite.song.duration % 60).padStart(2, '0')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No favorite songs yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => router.push('/songs')}
                      >
                        Browse Songs
                      </Button>
                </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playlists">
              <Card>
                <CardHeader>
                  <CardTitle>Your Playlists</CardTitle>
                  <CardDescription>Manage your music playlists</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPlaylists ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                      ))}
                    </div>
                  ) : playlists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {playlists.map((playlist) => (
                        <div 
                          key={playlist.id}
                          className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => router.push(`/playlists/${playlist.id}`)}
                        >
                          <div className="grid grid-cols-2 gap-1 absolute inset-0">
                            {playlist.previewImages.slice(0, 4).map((image, index) => (
                              <img
                                key={index}
                                src={image || "/images/default-song.png"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                            <p className="text-white/70 text-sm">{playlist.songCount} songs</p>
                </div>
              </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No playlists created yet</p>
                <Button
                  variant="outline"
                        className="mt-4"
                        onClick={() => router.push('/playlists/create')}
                      >
                        Create Playlist
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Settings */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </h3>
                    <Button onClick={() => router.push('/profile/edit')} variant="outline" className="w-full">
                      Edit Profile Information
                </Button>
                  </div>

                  {/* Subscription Management */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Subscription
                    </h3>
                    {isPremium ? (
                      <div className="space-y-4">
                        <div className="bg-green-500/10 text-green-500 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Active Premium Subscription</p>
                              <p className="text-sm mt-1">Next billing date: {format(new Date(profileData.subscription?.currentPeriodEnd || Date.now()), 'MMMM d, yyyy')}</p>
                            </div>
                            <Star className="h-5 w-5 fill-green-500" />
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push('/settings/subscription')}
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="font-medium">No Active Subscription</p>
                          <p className="text-sm text-muted-foreground mt-1">Upgrade to access premium features</p>
                        </div>
                <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push('/premium')}
                        >
                          Upgrade to Premium
                </Button>
              </div>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Danger Zone
                    </h3>
                    <Button 
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
          </div>
                </CardContent>
        </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}