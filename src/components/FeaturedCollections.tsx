'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MusicalNoteIcon as MusicIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
}

interface FeaturedCollectionsProps {
  collections: Collection[];
  isLoading: boolean;
}

export function FeaturedCollections({ collections, isLoading }: FeaturedCollectionsProps) {
  const router = useRouter();

  return (
    <section className="py-16 px-4 bg-background/40">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Featured Collections
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore our curated collections of songs
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/playlists')} 
            className="text-primary hover:text-primary/90"
          >
            View All
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <RequireAuth>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading collections...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/playlists/${collection.title.toLowerCase().replace(/ /g, '-')}`)}
                >
                  <CardHeader className="relative p-0">
                    <div className={`w-full aspect-square bg-gradient-to-br ${collection.gradient} rounded-t-lg p-6 flex flex-col justify-end group-hover:scale-[1.02] transition-transform`}>
                      <MusicIcon className="w-16 h-16 text-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      <div className="relative z-10 text-white">
                        <p className="text-sm font-medium uppercase tracking-wider opacity-80">
                          {collection.category}
                        </p>
                        <h3 className="text-xl font-bold mt-1">{collection.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {collection.count} songs • {collection.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </RequireAuth>
      </div>
    </section>
  );
} 