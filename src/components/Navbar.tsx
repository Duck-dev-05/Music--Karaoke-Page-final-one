'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu,
  Search,
  Music2,
  Mic2,
  ListMusic,
  Heart,
  Settings,
  LogIn,
  UserPlus,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaUser, FaSignOutAlt, FaCog, FaHistory, FaHeart } from 'react-icons/fa';

// Types
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  isSearching: boolean;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  expandedWidth?: string;
}

// Constants
const SEARCH_DEBOUNCE_MS = 300;
const SCROLL_THRESHOLD = 10;

const navItems: NavItem[] = [
  { 
    href: '/songs', 
    label: 'Songs', 
    icon: Music2,
    description: 'Browse all songs'
  },
  { 
    href: '/karaoke', 
    label: 'Karaoke', 
    icon: Mic2,
    description: 'Start singing karaoke'
  },
  { 
    href: '/playlists', 
    label: 'Playlists', 
    icon: ListMusic,
    description: 'Your music playlists'
  },
  { 
    href: '/favorites', 
    label: 'Favorites', 
    icon: Heart,
    description: 'Your favorite songs'
  },
];

// Animations
const menuAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeInOut' }
};

// Components
const SearchBar = memo(({ 
  query, 
  setQuery, 
  isSearching, 
  onSubmit, 
  placeholder = "Search songs...",
  className,
  width = "w-[200px]",
  expandedWidth = "focus:w-[250px]"
}: SearchBarProps) => (
  <form onSubmit={onSubmit} className="relative group">
    <Search className={cn(
      "absolute left-2.5 top-1.5 h-4 w-4 transition-colors",
      isSearching ? "text-primary animate-spin" : "text-muted-foreground"
    )} />
    <Input
      type="search"
      placeholder={placeholder}
      className={cn(
        "pl-8 h-8 transition-all bg-background/50 focus:bg-background",
        width,
        expandedWidth,
        className
      )}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </form>
));

SearchBar.displayName = 'SearchBar';

// Navigation Item Component
const NavItem = memo(({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link
    href={item.href}
    className={cn(
      "flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-all",
      "hover:bg-primary/10 hover:text-primary",
      isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
    )}
    title={item.description}
  >
    <item.icon className="h-4 w-4" />
    {item.label}
  </Link>
));

NavItem.displayName = 'NavItem';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Debounced search handler
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearching(false);
  }, [searchQuery, router]);

  // Theme toggle handler
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const handleSignOut = useCallback(() => {
    signOut({ redirect: true, callbackUrl: '/login' });
  }, []);

  const getInitials = useCallback((name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <Music2 className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Karaoke Music
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.href} 
                item={item} 
                isActive={pathname === item.href} 
              />
            ))}

            <div className="mx-2 h-5 w-px bg-border/60" />

            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              isSearching={isSearching}
              onSubmit={handleSearch}
            />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1">
            {status === 'authenticated' && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <FaUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center cursor-pointer">
                      <FaHeart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center cursor-pointer">
                      <FaHistory className="mr-2 h-4 w-4" />
                      <span>History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <FaCog className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" passHref>
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Menu Button and Search */}
          <div className="md:hidden flex items-center gap-2">
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              isSearching={isSearching}
              onSubmit={handleSearch}
              placeholder="Search..."
              width="w-[140px]"
              expandedWidth=""
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 transition-transform active:scale-95"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            {...menuAnimation}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href} 
                />
              ))}
              
              <div className="flex items-center gap-2 py-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              <div className="pt-2 space-y-1">
                {status === 'authenticated' && session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                          <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-gray-500">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <FaUser className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center cursor-pointer">
                          <FaHeart className="mr-2 h-4 w-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/history" className="flex items-center cursor-pointer">
                          <FaHistory className="mr-2 h-4 w-4" />
                          <span>History</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center cursor-pointer">
                          <FaCog className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 h-8" asChild>
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full justify-start gap-2 h-8 bg-primary hover:bg-primary/90" asChild>
                      <Link href="/register">
                        <UserPlus className="h-4 w-4" />
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default memo(Navbar);