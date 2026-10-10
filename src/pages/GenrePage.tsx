import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layers, ChevronLeft, ChevronRight, AlertCircle, Filter } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { FilterBar, FilterState } from '../components/ui/FilterBar';

export const GenrePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const currentSlug = slug || 'action';
  const [page, setPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    status: 'all',
    type: 'all',
    sortBy: 'latest',
  });

  // Fetch all genres
  const { data: genresData } = useQuery({
    queryKey: ['animeGenres'],
    queryFn: () => animeApi.getGenres(),
  });

  // Fetch anime by selected genre
  const { data: animeData, isLoading, isError } = useQuery({
    queryKey: ['animeByGenre', currentSlug, page],
    queryFn: () => animeApi.getAnimeByGenre(currentSlug, page),
  });

  const genreList = genresData?.data?.genreList || [];
  const rawAnimeItems = useMemo(() => animeData?.data?.animeList || [], [animeData]);
  const currentGenreObj = genreList.find((g) => g.genreId === currentSlug);

  const filteredAnimeItems = useMemo(() => {
    let list = [...rawAnimeItems];
    if (filters.status !== 'all') {
      list = list.filter((a) =>
        a.status ? a.status.toLowerCase().includes(filters.status) : true
      );
    }
    if (filters.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [rawAnimeItems, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-850 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Category Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {currentGenreObj ? `${currentGenreObj.title} Anime` : 'Anime by Genre'}
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Filter Otakudesu archives by curated tags and genres.
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto ${
              showFilters
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border-zinc-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
          </button>
        </div>

        {showFilters && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}
      </div>

      {/* Genre Grid Selector (Horizontal scrollable with smooth touch) */}
      {genreList.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {genreList.map((g) => {
            const isSelected = g.genreId === currentSlug;
            return (
              <Link
                key={g.genreId}
                to={`/genre/${g.genreId}`}
                onClick={() => setPage(1)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {g.title}
              </Link>
            );
          })}
        </div>
      )}

      {/* Filtered Anime Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Failed to load genre archives.</p>
        </div>
      ) : filteredAnimeItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredAnimeItems.map((anime) => (
              <AnimeCard
                key={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                slug={anime.animeId}
                score={anime.score}
                episodes={anime.episodes}
                type="Anime"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-900">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 flex items-center gap-1.5"
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
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs text-white flex items-center gap-1.5 shadow-md shadow-red-950/40"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500">
          No titles found in this category.
        </div>
      )}
    </div>
  );
};

export default GenrePage;
