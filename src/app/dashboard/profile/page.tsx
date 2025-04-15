'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface UserProfile {
  fullName: string;
  email: string;
  profilePicture: string;
  bio: string;
  type: string;
  favoriteGenres: string[];
  totalSongs: number;
  totalPlaylists: number;
  joinedDate: string;
  lastActive: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      toast.error('Error loading profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: profile?.fullName,
          profilePicture: profile?.profilePicture,
          bio: profile?.bio,
          favoriteGenres: profile?.favoriteGenres,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="grid gap-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.fullName}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <Badge className="absolute -top-2 -right-2" variant="secondary">
              {profile.type}
            </Badge>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{profile.fullName}</h1>
            <p className="text-muted-foreground">Member since {new Date(profile.joinedDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.totalSongs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.totalPlaylists}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{new Date(profile.lastActive).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled={true}
                readOnly
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profilePicture">Profile Picture URL</Label>
              <Input
                id="profilePicture"
                value={profile.profilePicture}
                onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Favorite Genres</Label>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteGenres.map((genre, index) => (
                  <Badge key={index} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={fetchProfile}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 