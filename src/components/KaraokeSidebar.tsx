import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Search,
  History,
  ListMusic,
  Settings,
  Sun,
  Moon,
  Facebook,
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface KaraokeSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function KaraokeSidebar({ activeTab, onTabChange, className }: KaraokeSidebarProps) {
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: 'search', icon: Search, label: 'Tìm kiếm' },
    { id: 'suggestions', icon: History, label: 'Đề xuất/Lịch sử' },
    { id: 'selected', icon: ListMusic, label: 'Đã chọn (0)' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div className={cn('w-64 h-screen flex flex-col bg-background border-r', className)}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Karaoke</h1>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2',
                  activeTab === tab.id && 'bg-secondary'
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => window.open('https://facebook.com', '_blank')}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              Sáng
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Tối
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 