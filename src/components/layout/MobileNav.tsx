import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Calendar, History, Heart, BookOpen } from 'lucide-react';
import { useWatchHistory } from '../../hooks/useWatchHistory';

interface MobileNavProps {
  isNsfwUnlocked: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isNsfwUnlocked }) => {
  const location = useLocation();
  const { bookmarks, watchHistory } = useWatchHistory();

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Ongoing', path: '/ongoing', icon: Flame },
    { label: 'Schedule', path: '/schedule', icon: Calendar },
    { label: 'Comics', path: '/comic', icon: BookOpen },
    {
      label: 'Favorites',
      path: '/library?tab=bookmarks',
      icon: Heart,
      badge: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
    {
      label: 'History',
      path: '/library?tab=watch',
      icon: History,
      dot: watchHistory.length > 0,
    },
  ];

  if (isNsfwUnlocked) {
    items.push({ label: '18+', path: '/nsfw', icon: Flame, badge: undefined, dot: false });
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-850 px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : item.path.includes('?')
            ? location.pathname + location.search === item.path
            : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center justify-center p-1.5 min-w-[46px] transition-colors ${
              isActive
                ? item.path === '/nsfw'
                  ? 'text-red-500 font-bold'
                  : 'text-red-500 font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4 mb-0.5" />
              {item.dot && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
              )}
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-bold bg-red-600 text-white rounded-full leading-tight">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
