import React from 'react';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';

export interface FilterState {
  genre: string;
  status: string;
  type: string;
  sortBy: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableGenres?: string[];
  className?: string;
}

const DEFAULT_GENRES = [
  'All',
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Isekai',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Shounen',
  'Supernatural',
];

const STATUS_OPTIONS = [
  { id: 'all', label: 'All Status' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
];

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'tv', label: 'TV Series' },
  { id: 'movie', label: 'Movie' },
  { id: 'donghua', label: 'Donghua' },
];

const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest Updates' },
  { id: 'score', label: 'Top Rated' },
  { id: 'title', label: 'Title (A-Z)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  availableGenres = DEFAULT_GENRES,
  className = '',
}) => {
  return (
    <div className={`w-full p-3 sm:p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 tracking-wider uppercase font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
          <span>Filters & Display Mode</span>
        </div>

        {(filters.genre !== 'All' || filters.status !== 'all' || filters.type !== 'all' || filters.sortBy !== 'latest') && (
          <button
            onClick={() =>
              onChange({
                genre: 'All',
                status: 'all',
                type: 'all',
                sortBy: 'latest',
              })
            }
            className="text-[11px] text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Primary Status & Sort Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
            Status
          </label>
          <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange({ ...filters, status: opt.id })}
                className={`flex-1 py-1 px-1.5 text-[11px] font-medium rounded transition-colors truncate ${
                  filters.status === opt.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
            Format / Type
          </label>
          <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange({ ...filters, type: opt.id })}
                className={`flex-1 py-1 px-1.5 text-[11px] font-medium rounded transition-colors truncate ${
                  filters.type === opt.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
            Sort Order
          </label>
          <div className="flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange({ ...filters, sortBy: opt.id })}
                className={`flex-1 py-1 px-1.5 text-[11px] font-medium rounded transition-colors truncate ${
                  filters.sortBy === opt.id
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Genre Pills with Touch-friendly Horizontal Scroll */}
      <div className="pt-1 space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
          Filter by Genre
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableGenres.map((g) => {
            const isSelected = filters.genre === g;
            return (
              <button
                key={g}
                onClick={() => onChange({ ...filters, genre: g })}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
