import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Star,
  Bookmark,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { comicApi } from '../api/comicApi';
import { useWatchHistory } from '../hooks/useWatchHistory';

export const ComicDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [chapterSearch, setChapterSearch] = useState('');
  const [isAscending, setIsAscending] = useState(false);

  const { isBookmarked, toggleBookmark, readingHistory } = useWatchHistory();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comicDetail', slug],
    queryFn: () => comicApi.getComicDetail(slug || ''),
    enabled: !!slug,
  });

  const comic = data?.data;
  const bookmarked = slug ? isBookmarked(slug) : false;

  const chapters = comic?.chapters || [];

  const filteredChapters = chapters
    .filter((ch) => ch.title.toLowerCase().includes(chapterSearch.toLowerCase()))
    .sort((a, b) => {
      return isAscending
        ? a.title.localeCompare(b.title, undefined, { numeric: true })
        : b.title.localeCompare(a.title, undefined, { numeric: true });
    });

  // Check last read chapter from reading history
  const lastReadItem = readingHistory.find((r) => r.comicSlug === slug);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-56 h-80 bg-zinc-900 rounded-xl shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-zinc-900 rounded w-2/3" />
            <div className="h-4 bg-zinc-900 rounded w-1/3" />
            <div className="h-24 bg-zinc-900 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !comic) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-100">Comic Detail Not Found</h2>
        <p className="text-xs text-zinc-400">
          This title may have been removed or renamed in the Komikindo database.
        </p>
        <Link
          to="/comic"
          className="inline-block px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
        >
          Return to Comics
        </Link>
      </div>
    );
  }

  const firstChapter = chapters[chapters.length - 1]; // Chapter 1 usually at bottom
  const latestChapter = chapters[0];

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header Banner */}
      <div className="relative w-full border-b border-zinc-900 bg-zinc-950/80">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={comic.image}
            alt={comic.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-15 filter blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-cyan-950/30 shrink-0 mx-auto md:mx-0">
              <img
                src={comic.image}
                alt={comic.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Column */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {comic.detail?.alternativeTitle && (
                <p className="text-xs font-medium text-cyan-400 font-mono tracking-wide">
                  {comic.detail.alternativeTitle}
                </p>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                {comic.title.replace(/^Komik\s+/i, '')}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-300">
                {comic.rating && (
                  <span className="flex items-center gap-1 font-bold text-amber-400 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{comic.rating}</span>
                  </span>
                )}

                {comic.detail?.type && (
                  <span className="bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    {comic.detail.type}
                  </span>
                )}

                {comic.detail?.status && (
                  <span className="bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    {comic.detail.status}
                  </span>
                )}

                {comic.detail?.author && (
                  <span className="flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{comic.detail.author}</span>
                  </span>
                )}
              </div>

              {/* Genre Pills */}
              {comic.genres && comic.genres.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  {comic.genres.map((g) => (
                    <span
                      key={g.slug}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      {g.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {comic.synopsis && (
                <div className="pt-2">
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl line-clamp-4">
                    {comic.synopsis}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {lastReadItem ? (
                  <Link
                    to={`/comic/read/${lastReadItem.chapterSlug}`}
                    className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Resume: {lastReadItem.chapterTitle}</span>
                  </Link>
                ) : firstChapter ? (
                  <Link
                    to={`/comic/read/${firstChapter.slug}`}
                    className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Start Reading (Ch 1)</span>
                  </Link>
                ) : null}

                {latestChapter && (
                  <Link
                    to={`/comic/read/${latestChapter.slug}`}
                    className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider border border-zinc-800 transition-colors"
                  >
                    Latest: {latestChapter.title}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (slug) {
                      toggleBookmark({
                        id: slug,
                        title: comic.title,
                        slug,
                        poster: comic.image,
                        type: 'comic',
                      });
                    }
                  }}
                  className={`px-4 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    bookmarked
                      ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-400'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-cyan-400' : ''}`} />
                  <span>{bookmarked ? 'Bookmarked' : 'Add to Bookmarks'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              Chapters Index ({chapters.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter chapter number..."
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={() => setIsAscending(!isAscending)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 flex items-center gap-1"
              title="Sort chapters"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{isAscending ? '1 → N' : 'N → 1'}</span>
            </button>
          </div>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            No matching chapters found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredChapters.map((ch) => {
              const isRead = lastReadItem?.chapterSlug === ch.slug;
              return (
                <Link
                  key={ch.slug}
                  to={`/comic/read/${ch.slug}`}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 group ${
                    isRead
                      ? 'bg-cyan-950/40 border-cyan-800/60'
                      : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800 hover:border-cyan-500/60'
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 truncate">
                      {ch.title}
                    </p>
                    {ch.date && (
                      <p className="text-[10px] text-zinc-500 mt-0.5">{ch.date}</p>
                    )}
                  </div>

                  {isRead && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>READ</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComicDetailPage;
