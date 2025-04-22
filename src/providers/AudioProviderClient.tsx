'use client';

import { AudioProvider } from "@/contexts/AudioContext";
import { Playbar } from "@/components/Playbar";

export function AudioProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <main className="min-h-screen pb-24">
        {children}
      </main>
      <Playbar />
    </AudioProvider>
  );
} 