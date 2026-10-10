import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { comicApi } from '../api/comicApi';
import { ComicCard } from '../components/cards/ComicCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { useDebounce } from '../hooks/useDebounce';

export const ComicHomePage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce(searchInput, 700);

  const isSearching = debouncedSearch.trim().length >= 3;

  // Query latest comics
  const {
    data: latestData,
    isLoading: isLoadingLatest,
    isError: isLatestError,
  } = useQuery({
    queryKey: ['comicLatest', page],
    queryFn: () => comicApi.getLatestComics(page),
    enabled: !isSearching,
  });

  // Query search comics (700ms debounce, minimum 3-character trigger)
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isError: isSearchError,
  } = useQuery({
    queryKey: ['comicSearch', debouncedSearch, page],
    queryFn: () => comicApi.searchComics(debouncedSearch.trim(), page),
    enabled: isSearching,
  });

  const comics = isSearching
    ? searchData?.komikList || []
    : latestData?.komikList || [];

  const pagination = isSearching ? searchData?.pagination : latestData?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-850 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Manga & Manhwa Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            {isSearching ? `Search: "${debouncedSearch}"` : 'Latest Comic Updates'}
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Read high-quality Indonesian translations for Manga, Manhwa, and Manhua from Komikindo.
          </p>
        </div>

        {/* Search Input with 700ms Debounce */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search titles (min 3 chars)..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Comics Grid */}
      {isLoadingLatest || isLoadingSearch ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isLatestError || isSearchError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Failed to load comics directory.</p>
        </div>
      ) : comics.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {comics.map((comic) => (
              <ComicCard
                key={comic.slug}
                title={comic.title}
                image={comic.image}
                slug={comic.slug}
                type={comic.type}
                color={comic.color}
                latestChapter={comic.chapters?.[0]}
              />
            ))}
          </div>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-900">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              Page {page} {pagination?.totalPages ? `of ${pagination.totalPages}` : ''}
            </span>

            <button
              disabled={pagination && !pagination.hasNextPage}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs text-white flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500">
          No comics found matching your query.
        </div>
      )}
    </div>
  );
};

export default ComicHomePage;
