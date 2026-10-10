import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Film, BookOpen, AlertCircle, Filter } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { comicApi } from '../api/comicApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { ComicCard } from '../components/cards/ComicCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { useDebounce } from '../hooks/useDebounce';
import { Tabs } from '../components/ui/Tabs';
import { FilterBar, FilterState } from '../components/ui/FilterBar';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(initialQuery);
  const debouncedQuery = useDebounce(inputVal, 700);
  const [activeTab, setActiveTab] = useState<'anime' | 'comic'>('anime');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    status: 'all',
    type: 'all',
    sortBy: 'latest',
  });

  // Sync URL search params
  useEffect(() => {
    if (debouncedQuery.trim().length >= 3) {
      setSearchParams({ q: debouncedQuery.trim() }, { replace: true });
    }
  }, [debouncedQuery, setSearchParams]);

  const isValidQuery = debouncedQuery.trim().length >= 3;

  // Search Anime
  const {
    data: animeSearchData,
    isLoading: isLoadingAnime,
    isError: isAnimeError,
  } = useQuery({
    queryKey: ['searchAnime', debouncedQuery],
    queryFn: () => animeApi.searchAnime(debouncedQuery.trim()),
    enabled: isValidQuery && activeTab === 'anime',
  });

  // Search Comics
  const {
    data: comicSearchData,
    isLoading: isLoadingComic,
    isError: isComicError,
  } = useQuery({
    queryKey: ['searchComic', debouncedQuery],
    queryFn: () => comicApi.searchComics(debouncedQuery.trim(), 1),
    enabled: isValidQuery && activeTab === 'comic',
  });

  const rawAnimeResults = useMemo(() => animeSearchData?.data?.animeList || [], [animeSearchData]);
  const rawComicResults = useMemo(() => comicSearchData?.komikList || [], [comicSearchData]);

  const animeResults = useMemo(() => {
    let list = [...rawAnimeResults];
    if (filters.status !== 'all') {
      list = list.filter((a) =>
        a.status ? a.status.toLowerCase().includes(filters.status) : true
      );
    }
    if (filters.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [rawAnimeResults, filters]);

  const comicResults = useMemo(() => {
    let list = [...rawComicResults];
    if (filters.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [rawComicResults, filters]);

  const tabs = [
    { id: 'anime', label: 'Anime Results', count: isValidQuery ? animeResults.length : undefined },
    { id: 'comic', label: 'Comic Results', count: isValidQuery ? comicResults.length : undefined },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 pb-24">
      {/* Search Header & Input */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          Universal Search
        </h1>
        <p className="text-xs text-zinc-400">
          Search Otakudesu anime episodes and Komikindo manga titles simultaneously. Minimum 3 characters required.
        </p>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Type at least 3 characters..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-lg"
          />
        </div>
      </div>

      {/* Tabs and Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'anime' | 'comic')}
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto ${
            showFilters
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 border-zinc-800'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{showFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
        </button>
      </div>

      {showFilters && (
        <FilterBar filters={filters} onChange={setFilters} />
      )}

      {/* Results Area */}
      {!isValidQuery ? (
        <div className="py-20 text-center text-xs text-zinc-500 space-y-1">
          <p>Please enter at least 3 characters to trigger search.</p>
          <p className="text-zinc-600 font-mono">Debounce active: 700ms throttle</p>
        </div>
      ) : activeTab === 'anime' ? (
        isLoadingAnime ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <SkeletonCard count={6} />
          </div>
        ) : isAnimeError ? (
          <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">No matching anime found or server error.</p>
          </div>
        ) : animeResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {animeResults.map((anime) => (
              <AnimeCard
                key={anime.animeId}
                title={anime.title}
                poster={anime.poster}
                slug={anime.animeId}
                score={anime.score}
                status={anime.status}
                type="Anime"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-zinc-500">
            No anime found for &quot;{debouncedQuery}&quot;.
          </div>
        )
      ) : isLoadingComic ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <SkeletonCard count={6} />
        </div>
      ) : isComicError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">No matching comics found or server error.</p>
        </div>
      ) : comicResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {comicResults.map((comic) => (
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
      ) : (
        <div className="py-20 text-center text-xs text-zinc-500">
          No comics found for &quot;{debouncedQuery}&quot;.
        </div>
      )}
    </div>
  );
};

export default SearchPage;
