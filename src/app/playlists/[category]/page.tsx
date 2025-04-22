"use client";

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

const validCategories = ["recent", "vietnamese", "remix", "all"];

export default function PlaylistPage({
  params,
}: {
  params: { category: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { category } = params;

  useEffect(() => {
    // Validate category
    if (!validCategories.includes(category)) {
      router.push('/404');
      return;
    }

    // Handle authentication
    if (!session?.user) {
      router.push('/login');
    }
  }, [category, router, session]);

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-semibold">Sign in to view playlists</h1>
        <p className="text-muted-foreground">
          Create an account or sign in to access your playlists
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-outline">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Access control based on user type
  const isPremium = session.user.email === "premium@test.com";
  const maxSongs = isPremium ? 10 : 2;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {category === "recent" ? "Recent Additions" :
         category === "vietnamese" ? "Vietnamese Songs" :
         category === "remix" ? "Remixes" :
         "All Songs"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Playlist items will be rendered here */}
      </div>
    </div>
  );
} 