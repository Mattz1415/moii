import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Bookmark, Heart } from 'lucide-react';
import { useWatchHistory } from '../../hooks/useWatchHistory';

interface AnimeCardProps {
  title: string;
  poster: string;
  slug: string;
  episodes?: string | number | null;
  score?: string | null;
  releaseDay?: string;
  status?: string;
  type?: string;
  badgeText?: string;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  title,
  poster,
  slug,
  episodes,
  score,
  releaseDay,
  status,
  type = 'Anime',
  badgeText,
}) => {
  const [imgError, setImgError] = useState(false);
  const { isBookmarked, toggleBookmark } = useWatchHistory();
  const bookmarked = isBookmarked(slug);

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-red-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-950/20">
      {/* Poster Image Container */}
      <Link
        to={`/anime/${slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 block"
      >
        {!imgError && poster ? (
          <img
            src={poster}
            alt={title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600">
            <Play className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs text-center line-clamp-2 text-zinc-400 font-medium">
              {title}
            </span>
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Tags */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950/80 text-cyan-400 backdrop-blur-sm border border-cyan-900/40">
            {badgeText || type}
          </span>
          {score && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-950/80 text-amber-300 backdrop-blur-sm border border-amber-900/40 tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {score}
            </span>
          )}
        </div>

        {/* Hover Quick Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-950/50 backdrop-blur-sm transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <Link to={`/anime/${slug}`} className="block">
          <h3
            title={title}
            className="text-xs font-semibold text-zinc-100 group-hover:text-red-400 line-clamp-2 transition-colors leading-snug"
          >
            {title}
          </h3>
        </Link>

        <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            {episodes && (
              <span className="text-zinc-300 font-medium tabular-nums">
                {typeof episodes === 'number' ? `Ep ${episodes}` : episodes}
              </span>
            )}
            {episodes && (releaseDay || status) && <span aria-hidden="true">·</span>}
            {releaseDay && <span>{releaseDay}</span>}
            {!releaseDay && status && <span>{status}</span>}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark({
                id: slug,
                title,
                slug,
                poster,
                type: 'anime',
              });
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-red-500 hover:text-red-400 bg-red-950/40'
                : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'
            }`}
            title={bookmarked ? 'Remove Favorite' : 'Add to Favorites'}
            aria-label="Favorite anime"
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
