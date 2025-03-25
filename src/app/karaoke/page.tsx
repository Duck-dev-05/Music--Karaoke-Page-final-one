
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MusicIcon, SearchIcon } from 'lucide-react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
          Karaoke Room
        </h1>
        
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for songs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <MusicIcon className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-card rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-muted rounded-md mb-4" />
              <h3 className="font-semibold mb-2">Song Title {item}</h3>
              <p className="text-sm text-muted-foreground">Artist Name</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">3:45</span>
                <Button variant="secondary" size="sm">
                  Start Karaoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
