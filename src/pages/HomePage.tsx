import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Flame,
  Sparkles,
  BookOpen,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { comicApi } from '../api/comicApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { ComicCard } from '../components/cards/ComicCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { ContinueWatchingRow } from '../components/player/ContinueWatchingRow';
import { FilterBar, FilterState } from '../components/ui/FilterBar';

export const HomePage: React.FC = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchHeroQuery, setSearchHeroQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    status: 'all',
    type: 'all',
    sortBy: 'latest',
  });

  const navigate = useNavigate();

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHeroQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchHeroQuery.trim())}`);
    }
  };

  // TanStack Query for Home Anime (staleTime 10m is handled globally)
  const {
    data: homeData,
    isLoading: isLoadingHome,
    isError: isHomeError,
    refetch: refetchHome,
  } = useQuery({
    queryKey: ['animeHome'],
    queryFn: () => animeApi.getHome(),
  });

  // Query Donghua home
  const { data: donghuaData, isLoading: isLoadingDonghua } = useQuery({
    queryKey: ['donghuaHome'],
    queryFn: () => animeApi.getDonghuaHome(),
  });

  // Query Latest Comics
  const { data: comicData, isLoading: isLoadingComics } = useQuery({
    queryKey: ['comicLatestHome'],
    queryFn: () => comicApi.getLatestComics(1),
  });

  // Query Genres
  const { data: genresData } = useQuery({
    queryKey: ['animeGenres'],
    queryFn: () => animeApi.getGenres(),
  });

  const ongoingList = useMemo(
    () => homeData?.data?.ongoing?.animeList || [],
    [homeData]
  );
  const completedList = useMemo(
    () => homeData?.data?.completed?.animeList || [],
    [homeData]
  );
  const heroAnime = ongoingList[heroIndex] || ongoingList[0];

  const availableGenreTitles = useMemo(() => {
    const list = ['All'];
    if (genresData?.data?.genreList) {
      genresData.data.genreList.forEach((g) => list.push(g.title));
    }
    return list;
  }, [genresData]);

  // Apply filters to ongoing and completed lists
  const filteredOngoingList = useMemo(() => {
    let result = [...ongoingList];

    if (filters.status === 'completed') {
      return []; // Ongoing list has only ongoing
    }

    if (filters.sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [ongoingList, filters]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col gap-8 sm:gap-12 pb-24">
      {/* Hero Spotlight Section */}
      {heroAnime ? (
        <section className="relative w-full h-[480px] sm:h-[520px] md:h-[580px] overflow-hidden border-b border-zinc-900 bg-zinc-950">
          {/* Backdrop Image with Cyberpunk Scrim */}
          <div className="absolute inset-0">
            <img
              src={heroAnime.poster}
              alt={heroAnime.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top opacity-30 filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 z-10">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-xs text-red-500 font-semibold tracking-wider uppercase font-mono">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                <span>Featured Ongoing Broadcast</span>
                {heroAnime.releaseDay && (
                  <>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{heroAnime.releaseDay}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white line-clamp-2 leading-tight">
                {heroAnime.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                {heroAnime.episodes && (
                  <span className="font-semibold text-zinc-200">
                    Episode {heroAnime.episodes}
                  </span>
                )}
                {heroAnime.latestReleaseDate && (
                  <>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>Updated {heroAnime.latestReleaseDate}</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/anime/${heroAnime.animeId}`}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/50 transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Stream Now</span>
                </Link>

                <Link
                  to={`/anime/${heroAnime.animeId}`}
                  className="px-5 py-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs tracking-wider uppercase border border-zinc-800 transition-colors"
                >
                  View Details
                </Link>
              </div>

              {/* Hero Search Bar for Tablet & Mobile Android Quick Discover */}
              <form
                onSubmit={handleHeroSearchSubmit}
                className="pt-2 max-w-lg relative flex items-center"
              >
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Quick search any anime, donghua, or comic..."
                  value={searchHeroQuery}
                  onChange={(e) => setSearchHeroQuery(e.target.value)}
                  className="w-full bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 rounded-xl pl-10 pr-20 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 backdrop-blur-md focus:outline-none transition-all shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 text-[11px] font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Hero Selector Thumbnails (Desktop & Tablet) */}
            {ongoingList.length > 1 && (
              <div className="hidden md:flex items-center gap-2 absolute right-8 bottom-12 z-20">
                {ongoingList.slice(0, 5).map((item, idx) => (
                  <button
                    key={item.animeId}
                    onClick={() => setHeroIndex(idx)}
                    className={`w-12 h-16 rounded overflow-hidden border transition-all ${
                      heroIndex === idx
                        ? 'border-red-500 scale-105 shadow-md shadow-red-950'
                        : 'border-zinc-850 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 w-full">
        {/* Continue Watching Section (Instant Local Storage Watch Progress) */}
        <ContinueWatchingRow />

        {/* Filter Toggle and Genre Pill Bar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
              <span>EXPLORE GENRES:</span>
            </span>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showFilters
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-zinc-900/80 hover:bg-zinc-850 text-zinc-300 border-zinc-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showFilters ? 'Hide Filters' : 'Filter & Sort'}</span>
            </button>
          </div>

          {/* Interactive Filter Drawer/Bar */}
          {showFilters && (
            <FilterBar
              filters={filters}
              onChange={setFilters}
              availableGenres={availableGenreTitles}
            />
          )}

          {/* Genre Scrollable Pills */}
          {genresData?.data?.genreList && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {genresData.data.genreList.slice(0, 16).map((genre) => (
                <Link
                  key={genre.genreId}
                  to={`/genre/${genre.genreId}`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-xs border border-zinc-850 whitespace-nowrap transition-colors"
                >
                  {genre.title}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Ongoing Anime Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                Ongoing Anime Releases
              </h2>
            </div>
            <Link
              to="/ongoing"
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingHome ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              <SkeletonCard count={6} />
            </div>
          ) : isHomeError ? (
            <div className="p-8 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-zinc-400">Unable to load anime feed at this moment.</p>
              <button
                onClick={() => refetchHome()}
                className="px-4 py-2 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Feed
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredOngoingList.slice(0, 12).map((anime) => (
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
          )}
        </section>

        {/* Donghua Spotlight */}
        {donghuaData?.latest_release && donghuaData.latest_release.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                  Latest Donghua (Chinese Anime)
                </h2>
              </div>
              <Link
                to="/donghua"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Browse Donghua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingDonghua ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <SkeletonCard count={6} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {donghuaData.latest_release.slice(0, 6).map((donghua) => (
                  <AnimeCard
                    key={donghua.slug}
                    title={donghua.title}
                    poster={donghua.poster}
                    slug={donghua.slug}
                    badgeText="Donghua"
                    type="Donghua"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Latest Comics & Manga Spotlight */}
        {comicData?.komikList && comicData.komikList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                  Fresh Manga & Manhwa Chapters
                </h2>
              </div>
              <Link
                to="/comic"
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Browse Comics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingComics ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <SkeletonCard count={6} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {comicData.komikList.slice(0, 6).map((comic) => (
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
            )}
          </section>
        )}

        {/* Completed Anime Section */}
        {completedList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                  Completed Series & Classics
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {completedList.slice(0, 6).map((anime) => (
                <AnimeCard
                  key={anime.animeId}
                  title={anime.title}
                  poster={anime.poster}
                  slug={anime.animeId}
                  episodes={anime.episodes}
                  score={anime.score}
                  type="Completed"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
