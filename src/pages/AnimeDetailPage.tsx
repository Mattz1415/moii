import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Play,
  Star,
  Bookmark,
  Calendar,
  Clock,
  Tv,
  Film,
  Download,
  AlertCircle,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { useWatchHistory } from '../hooks/useWatchHistory';

export const AnimeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [isAscending, setIsAscending] = useState(false);

  const { isBookmarked, toggleBookmark } = useWatchHistory();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['animeDetail', slug],
    queryFn: () => animeApi.getAnimeDetail(slug || ''),
    enabled: !!slug,
  });

  const anime = data?.data;
  const bookmarked = slug ? isBookmarked(slug) : false;

  const episodeList = anime?.episodeList || [];

  const filteredEpisodes = episodeList
    .filter((ep) =>
      ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
      (ep.eps !== undefined && String(ep.eps).includes(episodeSearch))
    )
    .sort((a, b) => {
      const numA = Number(a.eps) || 0;
      const numB = Number(b.eps) || 0;
      return isAscending ? numA - numB : numB - numA;
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-56 h-80 bg-zinc-900 rounded-xl shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-zinc-900 rounded w-2/3" />
            <div className="h-4 bg-zinc-900 rounded w-1/3" />
            <div className="h-20 bg-zinc-900 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !anime) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-100">Anime Detail Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested series might have been moved or removed from the source index.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Extract synopsis text
  let synopsisText = '';
  if (typeof anime.synopsis === 'string') {
    synopsisText = anime.synopsis;
  } else if (anime.synopsis?.paragraphs) {
    synopsisText = anime.synopsis.paragraphs.join('\n\n');
  }

  const firstEpisode = episodeList[episodeList.length - 1]; // Episode 1 usually at end of otakudesu array

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Detail Header Hero */}
      <div className="relative w-full border-b border-zinc-900 bg-zinc-950/80">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={anime.poster}
            alt={anime.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-15 filter blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-red-950/30 shrink-0 mx-auto md:mx-0">
              <img
                src={anime.poster}
                alt={anime.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Column */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {anime.japanese && (
                <p className="text-xs font-medium text-red-500 font-mono tracking-wide">
                  {anime.japanese}
                </p>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                {anime.title}
              </h1>

              {/* Metadata Badges / Info Strip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-300">
                {anime.score && (
                  <span className="flex items-center gap-1 font-bold text-amber-400 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{anime.score}</span>
                  </span>
                )}

                {anime.type && (
                  <span className="flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    <Tv className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{anime.type}</span>
                  </span>
                )}

                {anime.status && (
                  <span className="bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    {anime.status}
                  </span>
                )}

                {anime.duration && (
                  <span className="flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{anime.duration}</span>
                  </span>
                )}

                {anime.aired && (
                  <span className="flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{anime.aired}</span>
                  </span>
                )}
              </div>

              {/* Genre Pills */}
              {anime.genreList && anime.genreList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  {anime.genreList.map((g) => (
                    <Link
                      key={g.genreId}
                      to={`/genre/${g.genreId}`}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-cyan-400 border border-zinc-800 transition-colors"
                    >
                      {g.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {synopsisText && (
                <div className="pt-2">
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl line-clamp-4 whitespace-pre-line">
                    {synopsisText}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {firstEpisode && (
                  <Link
                    to={`/watch/${firstEpisode.episodeId}`}
                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/50 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Watching (Ep {firstEpisode.eps || '1'})</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (slug) {
                      toggleBookmark({
                        id: slug,
                        title: anime.title,
                        slug,
                        poster: anime.poster,
                        type: 'anime',
                      });
                    }
                  }}
                  className={`px-4 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-colors ${
                    bookmarked
                      ? 'bg-red-950/60 border-red-700/60 text-red-400'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-red-400' : ''}`} />
                  <span>{bookmarked ? 'Bookmarked' : 'Add to Bookmarks'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Episodes Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-red-500" />
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Available Episodes ({episodeList.length})
              </h2>
            </div>

            {/* Episode Search & Sort */}
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter episode..."
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                onClick={() => setIsAscending(!isAscending)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-800 flex items-center gap-1"
                title="Sort episodes"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{isAscending ? '1 → N' : 'N → 1'}</span>
              </button>
            </div>
          </div>

          {filteredEpisodes.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No matching episodes found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredEpisodes.map((ep) => (
                <Link
                  key={ep.episodeId}
                  to={`/watch/${ep.episodeId}`}
                  className="p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 hover:border-red-600/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded bg-zinc-800 group-hover:bg-red-600 text-zinc-300 group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                      {ep.eps || '•'}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {ep.title}
                      </p>
                      {ep.date && (
                        <p className="text-[10px] text-zinc-500 mt-0.5">{ep.date}</p>
                      )}
                    </div>
                  </div>

                  <Play className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 shrink-0 fill-current" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Batch Downloads if available */}
        {anime.batch && (
          <section className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-xs font-semibold text-zinc-200">Full Season Batch Download</h3>
                <p className="text-[11px] text-zinc-400">Download all episodes in a single archive</p>
              </div>
            </div>
            {anime.batch.batchId && (
              <a
                href={`https://otakudesu.blog/batch/${anime.batch.batchId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-cyan-300 transition-colors"
              >
                Access Mirrors
              </a>
            )}
          </section>
        )}

        {/* Recommended Anime Grid */}
        {anime.recommendedAnimeList && anime.recommendedAnimeList.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-zinc-850 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Recommended For You
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.recommendedAnimeList.slice(0, 6).map((rec) => (
                <AnimeCard
                  key={rec.animeId}
                  title={rec.title}
                  poster={rec.poster}
                  slug={rec.animeId}
                  type="Related"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnimeDetailPage;
