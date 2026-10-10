import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { FilterBar, FilterState } from '../components/ui/FilterBar';

export const OngoingPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    status: 'all',
    type: 'all',
    sortBy: 'latest',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ongoingAnime', page],
    queryFn: () => animeApi.getOngoing(page),
  });

  const rawAnimeList = useMemo(() => data?.data?.animeList || [], [data]);

  const filteredAnimeList = useMemo(() => {
    let list = [...rawAnimeList];

    if (searchFilter.trim().length > 0) {
      const q = searchFilter.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q));
    }

    if (filters.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [rawAnimeList, searchFilter, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-850 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Simulcast Broadcasts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Ongoing Anime Series
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Currently active seasonal broadcast series updated weekly with Indonesian subtitles.
            </p>
          </div>

          {/* Search & Filter Controls (Optimized for Android & Tablet touch) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter current page..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                showFilters
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-zinc-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Failed to load ongoing anime page.</p>
        </div>
      ) : filteredAnimeList.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredAnimeList.map((anime) => (
              <AnimeCard
                key={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                slug={anime.animeId}
                episodes={anime.episodes}
                releaseDay={anime.releaseDay}
                type="Ongoing"
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
              className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              Page {page}
            </span>

            <button
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs text-white flex items-center gap-1.5 shadow-md shadow-red-950/40 transition-colors"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500 space-y-2">
          <p>No titles matched your search query on Page {page}.</p>
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OngoingPage;
