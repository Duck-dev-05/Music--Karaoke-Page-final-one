import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal karaoke dashboard",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your karaoke experience and explore premium features
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Your Songs</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Playlists</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-2">Favorites</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          <div className="rounded-lg border">
            <div className="p-6">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
              <h3 className="font-semibold">Start Singing</h3>
              <p className="text-sm text-muted-foreground">Jump into karaoke mode</p>
            </button>
            <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
              <h3 className="font-semibold">Create Playlist</h3>
              <p className="text-sm text-muted-foreground">Organize your songs</p>
            </button>
            <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
              <h3 className="font-semibold">Browse Songs</h3>
              <p className="text-sm text-muted-foreground">Discover new tracks</p>
            </button>
            <button className="rounded-lg border bg-card p-6 text-left hover:bg-accent transition-colors">
              <h3 className="font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 