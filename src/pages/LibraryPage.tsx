import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  Clock,
  BookOpen,
  Trash2,
  Play,
  Heart,
  Search,
} from 'lucide-react';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { Tabs } from '../components/ui/Tabs';

export const LibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'bookmarks' | 'watch' | 'reading') || 'bookmarks';

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'watch' | 'reading'>(initialTab);
  const [filterText, setFilterText] = useState('');

  const {
    bookmarks,
    watchHistory,
    readingHistory,
    toggleBookmark,
    clearWatchHistory,
    clearReadingHistory,
  } = useWatchHistory();

  // Sync tab with URL
  const handleTabChange = (tabId: string) => {
    const valid = tabId as 'bookmarks' | 'watch' | 'reading';
    setActiveTab(valid);
    setSearchParams({ tab: valid }, { replace: true });
    setFilterText('');
  };

  const tabs = [
    { id: 'bookmarks', label: 'Favorites', count: bookmarks.length },
    { id: 'watch', label: 'Watch History', count: watchHistory.length },
    { id: 'reading', label: 'Reading History', count: readingHistory.length },
  ];

  const filteredBookmarks = useMemo(() => {
    if (!filterText.trim()) return bookmarks;
    const q = filterText.toLowerCase();
    return bookmarks.filter((b) => b.title.toLowerCase().includes(q));
  }, [bookmarks, filterText]);

  const filteredWatchHistory = useMemo(() => {
    if (!filterText.trim()) return watchHistory;
    const q = filterText.toLowerCase();
    return watchHistory.filter(
      (w) =>
        w.animeTitle.toLowerCase().includes(q) ||
        w.episodeTitle.toLowerCase().includes(q)
    );
  }, [watchHistory, filterText]);

  const filteredReadingHistory = useMemo(() => {
    if (!filterText.trim()) return readingHistory;
    const q = filterText.toLowerCase();
    return readingHistory.filter(
      (r) =>
        r.comicTitle.toLowerCase().includes(q) ||
        r.chapterTitle.toLowerCase().includes(q)
    );
  }, [readingHistory, filterText]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-850 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 text-red-500 fill-red-500/30" />
              <span>Personal Media Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Favorites & Watch History
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Track favorited shows, resume in-progress anime episodes, and continue reading manga panels.
            </p>
          </div>

          {/* Quick Search across user library */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search your library..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {activeTab === 'watch' && watchHistory.length > 0 && (
          <button
            onClick={clearWatchHistory}
            className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1.5 transition-colors self-start sm:self-auto p-1.5 rounded-lg hover:bg-zinc-900"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watch History</span>
          </button>
        )}

        {activeTab === 'reading' && readingHistory.length > 0 && (
          <button
            onClick={clearReadingHistory}
            className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1.5 transition-colors self-start sm:self-auto p-1.5 rounded-lg hover:bg-zinc-900"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Reading History</span>
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'bookmarks' && (
        filteredBookmarks.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500 space-y-3">
            <Heart className="w-10 h-10 text-zinc-700 mx-auto" />
            <p>
              {filterText
                ? `No favorites match "${filterText}"`
                : "You haven't added any titles to Favorites yet."}
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredBookmarks.map((b) => (
              <div
                key={b.id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-red-600/60 transition-all"
              >
                <Link
                  to={b.type === 'comic' ? `/comic/${b.slug}` : `/anime/${b.slug}`}
                  className="aspect-[3/4] w-full block bg-zinc-950 overflow-hidden relative"
                >
                  {b.poster ? (
                    <img
                      src={b.poster}
                      alt={b.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Bookmark className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950/80 text-cyan-400 border border-cyan-900/40 uppercase">
                    {b.type}
                  </span>
                </Link>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-snug">
                    {b.title}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <Link
                      to={b.type === 'comic' ? `/comic/${b.slug}` : `/anime/${b.slug}`}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => toggleBookmark(b)}
                      className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'watch' && (
        filteredWatchHistory.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500 space-y-3">
            <Clock className="w-10 h-10 text-zinc-700 mx-auto" />
            <p>
              {filterText
                ? `No watch history matches "${filterText}"`
                : 'Your watch history is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWatchHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {item.poster && (
                    <img
                      src={item.poster}
                      alt={item.animeTitle}
                      referrerPolicy="no-referrer"
                      className="w-14 sm:w-16 aspect-[3/4] object-cover rounded-md bg-zinc-950 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                      {item.animeTitle}
                    </h3>
                    <p className="text-xs text-red-400 mt-0.5 truncate font-medium">
                      {item.episodeTitle}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                      Watched {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/watch/${item.episodeSlug}`}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-red-950/40"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume</span>
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'reading' && (
        filteredReadingHistory.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500 space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-700 mx-auto" />
            <p>
              {filterText
                ? `No reading history matches "${filterText}"`
                : 'Your reading history is currently empty.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReadingHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.comicTitle}
                      referrerPolicy="no-referrer"
                      className="w-14 sm:w-16 aspect-[3/4] object-cover rounded-md bg-zinc-950 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                      {item.comicTitle}
                    </h3>
                    <p className="text-xs text-cyan-400 mt-0.5 truncate font-medium">
                      {item.chapterTitle}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                      Read {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/comic/read/${item.chapterSlug}`}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-cyan-950/40"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Continue</span>
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default LibraryPage;
