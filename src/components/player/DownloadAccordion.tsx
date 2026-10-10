import React, { useState } from 'react';
import { Download, ChevronDown, ExternalLink } from 'lucide-react';
import type { DownloadQuality } from '../../types/anime';

interface DownloadAccordionProps {
  qualities?: DownloadQuality[];
}

export const DownloadAccordion: React.FC<DownloadAccordionProps> = ({ qualities = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!qualities || qualities.length === 0) return null;

  return (
    <div className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Download className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-semibold text-zinc-200">
          DIRECT DOWNLOAD MIRRORS
        </h3>
      </div>

      <div className="space-y-2">
        {qualities.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-lg bg-zinc-950/60 border border-zinc-800/60 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-400">{item.title}</span>
                  {item.size && (
                    <span className="text-zinc-500 font-mono text-[11px]">
                      ({item.size})
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-1 border-t border-zinc-850 flex flex-wrap gap-2">
                  {item.urls.map((mirror, mIdx) => (
                    <a
                      key={mIdx}
                      href={mirror.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-cyan-300 text-xs transition-colors border border-zinc-800"
                    >
                      <span>{mirror.title}</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
