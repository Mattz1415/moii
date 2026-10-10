import React, { useState } from 'react';
import { X, Search, ArrowUpDown, Play, Check } from 'lucide-react';
import type { EpisodeListItem } from '../../types/anime';

interface EpisodeListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: EpisodeListItem[];
  currentEpisodeId: string;
  onSelectEpisode: (episodeId: string) => void;
}

export const EpisodeListDrawer: React.FC<EpisodeListDrawerProps> = ({
  isOpen,
  onClose,
  episodes = [],
  currentEpisodeId,
  onSelectEpisode,
}) => {
  const [search, setSearch] = useState('');
  const [isAscending, setIsAscending] = useState(false);

  if (!isOpen) return null;

  const filteredEpisodes = episodes
    .filter((ep) =>
      ep.title.toLowerCase().includes(search.toLowerCase()) ||
      (ep.eps !== undefined && String(ep.eps).includes(search))
    )
    .sort((a, b) => {
      const numA = Number(a.eps) || 0;
      const numB = Number(b.eps) || 0;
      return isAscending ? numA - numB : numB - numA;
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">All Episodes</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{episodes.length} episodes available</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            aria-label="Close episode drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Sort Bar */}
        <div className="p-3 border-b border-zinc-850 bg-zinc-900/60 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search episode number or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={() => setIsAscending(!isAscending)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 shrink-0"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{isAscending ? 'Oldest' : 'Newest'}</span>
          </button>
        </div>

        {/* Episode List Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              No matching episodes found
            </div>
          ) : (
            filteredEpisodes.map((ep) => {
              const isCurrent = ep.episodeId === currentEpisodeId;
              return (
                <button
                  key={ep.episodeId}
                  onClick={() => {
                    onSelectEpisode(ep.episodeId);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-lg text-left text-xs flex items-center justify-between gap-3 transition-colors ${
                    isCurrent
                      ? 'bg-red-950/60 border border-red-700/60 text-white font-medium'
                      : 'bg-zinc-900/50 hover:bg-zinc-850 text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-[11px] font-bold ${
                        isCurrent
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {ep.eps || '•'}
                    </div>
                    <span className="truncate">{ep.title}</span>
                  </div>

                  {isCurrent && (
                    <div className="flex items-center gap-1 text-[11px] text-red-400 shrink-0 font-mono">
                      <Play className="w-3 h-3 fill-red-400" />
                      <span>PLAYING</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
