"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import { EditProfileForm } from "@/components/forms/EditProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Music2, 
  Heart, 
  PlayCircle, 
  Crown,
  LogOut,
  Calendar
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: "Profile | Music Karaoke",
  description: "Manage your profile and account settings",
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    totalSongs: 0,
    totalPlaylists: 0,
    totalFavorites: 0,
    lastActive: new Date()
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const profileRes = await fetch('/api/user/profile');
        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileRes.json();

        // Update session with fresh data
        await updateSession({
          ...session,
          user: {
            ...session.user,
            ...profileData
          }
        });

        // Set user stats
        setUserStats({
          totalSongs: profileData.total_songs || 0,
          totalPlaylists: profileData.total_playlists || 0,
          totalFavorites: profileData.total_favorites || 0,
          lastActive: new Date(profileData.last_active)
        });

        // Fetch user activities
        const activitiesRes = await fetch('/api/user/activities');
        if (!activitiesRes.ok) throw new Error('Failed to fetch activities');
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, router, updateSession]);

  if (!session?.user) return null;

  const stats = [
    {
      label: "Favorite Songs",
      value: userStats.totalFavorites.toString(),
      icon: Heart,
      href: "/favorites"
    },
    {
      label: "Playlists",
      value: userStats.totalPlaylists.toString(),
      icon: Music2,
      href: "/playlists"
    },
    {
      label: "Karaoke Sessions",
      value: userStats.totalSongs.toString(),
      icon: PlayCircle,
      href: "/karaoke"
    }
  ];

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Overview */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback>
                  {session.user.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{session.user.name}</h2>
                <p className="text-muted-foreground">{session.user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Last active {formatDistanceToNow(userStats.lastActive, { addSuffix: true })}
                </p>
              </div>

              {session.user.bio && (
                <p className="text-sm max-w-md">{session.user.bio}</p>
              )}

              {session.user.premium && (
                <div className="flex items-center gap-1 text-primary">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm font-medium">Premium Member</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                {!session.user.premium && (
                  <Button variant="outline" onClick={() => router.push("/premium")}>
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <Button
                  key={stat.label}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push(stat.href)}
                >
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{activity.activity_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No recent activity to show
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <EditProfileForm onClose={() => setIsEditing(false)} />
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button 
              variant="destructive"
              onClick={() => {
                signOut({ callbackUrl: "/" });
                toast.success("Signed out successfully");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 