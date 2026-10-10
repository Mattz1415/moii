import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Bookmark,
  Flame,
  Heart,
  History,
  Calendar,
  X,
} from 'lucide-react';
import { AgeGateModal } from '../modals/AgeGateModal';
import { useWatchHistory } from '../../hooks/useWatchHistory';

interface NavbarProps {
  isNsfwUnlocked: boolean;
  onToggleNsfw: () => void;
  isAgeModalOpen: boolean;
  onConfirmAge: () => void;
  onCancelAge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isNsfwUnlocked,
  onToggleNsfw,
  isAgeModalOpen,
  onConfirmAge,
  onCancelAge,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookmarks, watchHistory } = useWatchHistory();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Anime', path: '/' },
    { label: 'Ongoing', path: '/ongoing' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Donghua', path: '/donghua' },
    { label: 'Comics', path: '/comic' },
  ];

  if (isNsfwUnlocked) {
    navLinks.push({ label: '18+ Zone', path: '/nsfw' });
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-base sm:text-lg font-black tracking-wider uppercase text-zinc-100 hover:text-red-500 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block shadow-sm shadow-red-600/80" />
            <span>
              SANKA<span className="text-red-600">VERSE</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Desktop & Tablet landscape) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
              const isNsfw = link.path === '/nsfw';

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? isNsfw
                        ? 'text-red-500 font-bold'
                        : 'text-zinc-100 font-bold border-b border-red-600 pb-0.5'
                      : isNsfw
                      ? 'text-red-400/90 hover:text-red-400'
                      : 'hover:text-zinc-200'
                  }`}
                >
                  {isNsfw && <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Search Bar (Adaptive for Mobile, Tablet, and Desktop) */}
          <div className="flex-1 max-w-xs sm:max-w-sm hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search anime, comic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </form>
          </div>

          {/* Zone 4: Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Toggle mobile search"
            >
              {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* NSFW SafeGate Toggle Button */}
            <button
              onClick={onToggleNsfw}
              className={`px-2 py-1.5 sm:px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isNsfwUnlocked
                  ? 'bg-red-950/80 text-red-400 border-red-700/60 hover:bg-red-900/60 shadow-sm shadow-red-950/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
              title={
                isNsfwUnlocked
                  ? 'NSFW Mode Active (Click to Lock)'
                  : 'NSFW Mode Locked (Click to Verify 18+)'
              }
            >
              {isNsfwUnlocked ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden md:inline">18+ ON</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="hidden md:inline">18+ OFF</span>
                </>
              )}
            </button>

            {/* Favorites CTA */}
            <Link
              to="/library?tab=bookmarks"
              className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-400 transition-colors"
              title="Favorites & Bookmarks"
              aria-label="Favorites"
            >
              <Heart className={`w-4 h-4 ${bookmarks.length > 0 ? 'text-red-500 fill-red-500/20' : ''}`} />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {bookmarks.length > 99 ? '99+' : bookmarks.length}
                </span>
              )}
            </Link>

            {/* History CTA */}
            <Link
              to="/library?tab=watch"
              className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-cyan-400 transition-colors hidden sm:flex items-center justify-center"
              title="Watch History"
              aria-label="Watch History"
            >
              <History className="w-4 h-4" />
              {watchHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
              )}
            </Link>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3 border-t border-zinc-850 bg-zinc-950 pt-2 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search anime, comic, movie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}
      </header>

      {/* 18+ Age Gate Modal */}
      <AgeGateModal
        isOpen={isAgeModalOpen}
        onConfirm={onConfirmAge}
        onCancel={onCancelAge}
      />
    </>
  );
};

export default Navbar;
