import React from 'react';

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/60 animate-pulse"
        >
          <div className="aspect-[3/4] w-full bg-zinc-800/80" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-4/5" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 bg-zinc-850 bg-zinc-800/60 rounded w-1/3" />
              <div className="h-3 bg-zinc-850 bg-zinc-800/60 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
