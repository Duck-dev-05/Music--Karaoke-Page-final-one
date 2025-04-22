"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { PersistentAudioPlayer } from "@/components/PersistentAudioPlayer";
import { AudioProvider } from "@/components/AudioProvider";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

interface RootLayoutTemplateProps {
  children: React.ReactNode;
  inter: ReturnType<typeof Inter>;
}

export default function RootLayoutTemplate({
  children,
  inter,
}: RootLayoutTemplateProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
      <AudioProvider>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pb-24">
            {children}
          </main>
          <Footer />
          <PersistentAudioPlayer />
          <MobileNav />
        </div>
      </AudioProvider>
    </div>
  );
} 