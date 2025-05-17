'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Music, Mic, ListMusic, Star, HelpCircle } from 'lucide-react';

const NAV_LINKS = [
  { href: '/songs', label: 'Songs', icon: Music },
  { href: '/karaoke', label: 'Karaoke', icon: Mic },
  { href: '/playlists', label: 'Playlists', icon: ListMusic },
  { href: '/premium', label: 'Premium', icon: Star },
  { href: '/support', label: 'Support', icon: HelpCircle },
];

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleProfileClick = () => {
    if (session) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Music Karaoke</span>
          </Link>
        </div>

        {/* Navigation & User */}
        <nav className="flex items-center gap-1 md:gap-3 lg:gap-5">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-base font-medium transition-all duration-150',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {pathname === item.href && (
                  <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-6 h-1 rounded-full bg-primary/60 opacity-80" />
                )}
              </Link>
            );
          })}

          {!session ? (
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 ml-2 focus:ring-2 focus:ring-primary/40">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 shadow-2xl border border-border/60 rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/payment">Payment</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 hover:bg-red-50 focus:bg-red-100"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;