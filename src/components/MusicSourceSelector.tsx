'use client';

import { 
  VideoCameraIcon, 
  MusicalNoteIcon, 
  CloudIcon, 
  FolderIcon 
} from '@heroicons/react/24/outline';

interface MusicSourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

const sources = [
  {
    id: 'local',
    name: 'Local Files',
    icon: FolderIcon,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: MusicalNoteIcon,
  },
  {
    id: 'mixcloud',
    name: 'Mixcloud',
    icon: CloudIcon,
  },
  {
    id: 'youtube',
    name: 'YouTube Music',
    icon: VideoCameraIcon,
  },
];

export default function MusicSourceSelector({ selectedSource, onSourceChange }: MusicSourceSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {sources.map((source) => {
        const Icon = source.icon;
        return (
          <button
            key={source.id}
            onClick={() => onSourceChange(source.id)}
            className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center ${
              selectedSource === source.id
                ? 'bg-purple-600 shadow-lg scale-105'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="font-medium text-sm">{source.name}</span>
          </button>
        );
      })}
    </div>
  );
} 