"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Music2, 
  Heart,
  Mail
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-1 items-center gap-4 text-sm leading-loose text-muted-foreground md:gap-6">
          <div className="flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            <span className="font-semibold">Karaoke Music</span>
          </div>
          <span>© {currentYear} All rights reserved</span>
        </div>

        <nav className="flex items-center gap-4 md:gap-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4" />
              <span className="sr-only">YouTube</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="mailto:contact@karaoke.com">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>by Team 4</span>
        </div>
      </div>
    </footer>
  );
} 