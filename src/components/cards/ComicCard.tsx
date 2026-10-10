import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, Heart } from 'lucide-react';
import { useWatchHistory } from '../../hooks/useWatchHistory';

interface ComicCardProps {
  title: string;
  image: string;
  slug: string;
  type?: string;
  color?: string;
  latestChapter?: {
    title: string;
    slug: string;
  };
}

export const ComicCard: React.FC<ComicCardProps> = ({
  title,
  image,
  slug,
  type = 'Manga',
  color,
  latestChapter,
}) => {
  const [imgError, setImgError] = useState(false);
  const { isBookmarked, toggleBookmark } = useWatchHistory();
  const bookmarked = isBookmarked(slug);

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-950/20">
      <Link
        to={`/comic/${slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 block"
      >
        {!imgError && image ? (
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600">
            <BookOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs text-center line-clamp-2 text-zinc-400 font-medium">
              {title}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950/80 text-cyan-400 backdrop-blur-sm border border-cyan-900/40">
            {type}
          </span>
          {color && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-950/80 text-zinc-300 backdrop-blur-sm border border-zinc-800">
              {color}
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <Link to={`/comic/${slug}`} className="block">
          <h3
            title={title}
            className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-400 line-clamp-2 transition-colors leading-snug"
          >
            {title}
          </h3>
        </Link>

        <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          {latestChapter ? (
            <Link
              to={`/comic/read/${latestChapter.slug}`}
              className="hover:text-cyan-400 truncate font-medium text-zinc-300"
              title={latestChapter.title}
            >
              {latestChapter.title}
            </Link>
          ) : (
            <span className="text-zinc-500">Read Chapters</span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark({
                id: slug,
                title,
                slug,
                poster: image,
                type: 'comic',
              });
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/40'
                : 'text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800'
            }`}
            title={bookmarked ? 'Remove Favorite' : 'Add to Favorites'}
            aria-label="Favorite comic"
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
