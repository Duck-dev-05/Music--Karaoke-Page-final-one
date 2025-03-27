import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LyricLine {
  time: number;
  text: string;
}

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  className?: string;
}

export function LyricsDisplay({ lyrics, currentTime, className }: LyricsDisplayProps) {
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  const getActiveLineIndex = () => {
    return lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      return line.time <= currentTime && (!nextLine || nextLine.time > currentTime);
    });
  };

  const activeIndex = getActiveLineIndex();

  return (
    <div className={cn("flex flex-col gap-2 max-h-[60vh] overflow-y-auto", className)}>
      {lyrics.map((line, index) => (
        <div
          key={index}
          ref={index === activeIndex ? activeLineRef : null}
          className={cn(
            "text-center transition-all duration-300",
            index === activeIndex
              ? "text-2xl font-bold text-primary"
              : index < activeIndex
              ? "text-lg text-muted-foreground"
              : "text-lg text-muted-foreground/50"
          )}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
} 