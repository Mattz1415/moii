import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, X, ChevronRight, Film } from 'lucide-react';
import { useWatchHistory, WatchHistoryItem } from '../../hooks/useWatchHistory';

export const ContinueWatchingRow: React.FC = () => {
  const { watchHistory, clearWatchHistory } = useWatchHistory();

  if (watchHistory.length === 0) return null;

  return (
    <section className="space-y-3 w-full">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm inline-block shadow-sm shadow-cyan-400/50" />
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <span>Continue Watching</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-800/50">
              {watchHistory.length} IN PROGRESS
            </span>
          </h2>
        </div>

        <Link
          to="/library"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Watch History</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal Scrollable Carousel with Touch Scrolling */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {watchHistory.slice(0, 10).map((item) => (
          <div
            key={item.episodeSlug}
            className="group relative flex flex-col w-56 sm:w-64 rounded-xl overflow-hidden bg-zinc-900/70 border border-zinc-800/80 hover:border-cyan-500/60 transition-all shrink-0 snap-start shadow-md hover:shadow-cyan-950/30"
          >
            {/* Poster Thumbnail */}
            <Link
              to={`/watch/${item.episodeSlug}`}
              className="relative aspect-video w-full overflow-hidden bg-zinc-950 block"
            >
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.animeTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                  <Film className="w-8 h-8" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg shadow-cyan-950 transform group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 ml-0.5 fill-black" />
                </div>
              </div>

              {/* Episode Badge */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-medium text-white pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-zinc-800 truncate max-w-[150px]">
                  {item.episodeTitle}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-300 font-mono">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Resume</span>
                </span>
              </div>

              {/* Cyan Progress Bar Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div className="h-full bg-cyan-400 w-3/4 shadow-sm shadow-cyan-400/80" />
              </div>
            </Link>

            {/* Title & Info Strip */}
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link
                  to={`/watch/${item.episodeSlug}`}
                  className="block text-xs font-semibold text-zinc-100 group-hover:text-cyan-400 truncate leading-snug"
                >
                  {item.animeTitle}
                </Link>
                <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                  {item.episodeTitle}
                </p>
              </div>

              <Link
                to={`/watch/${item.episodeSlug}`}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-cyan-600 hover:text-black text-zinc-300 transition-colors shrink-0"
                title="Play Episode"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
