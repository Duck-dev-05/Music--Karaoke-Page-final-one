import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SpotifySearchProps {
  searchQuery: string;
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function SpotifySearch({ searchQuery, isLoading, onSearchChange, onSearch }: SpotifySearchProps) {
  return (
    <form onSubmit={onSearch} className="mb-6">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-11 bg-muted/50 border-none"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </form>
  );
} 