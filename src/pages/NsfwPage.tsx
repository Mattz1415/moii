import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, ShieldAlert, ChevronLeft, ChevronRight, AlertCircle, Play, Eye } from 'lucide-react';
import { nsfwApi } from '../api/nsfwApi';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { Tabs } from '../components/ui/Tabs';
import { AgeGateModal } from '../components/modals/AgeGateModal';

interface NsfwPageProps {
  isUnlocked?: boolean;
  onOpenAgeGate?: () => void;
  isAgeModalOpen?: boolean;
  onConfirmAge?: () => void;
  onCancelAge?: () => void;
}

export const NsfwPage: React.FC<NsfwPageProps> = ({
  isUnlocked = false,
  onOpenAgeGate = () => {},
  isAgeModalOpen = false,
  onConfirmAge = () => {},
  onCancelAge = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'hentai' | 'jav' | 'release'>('hentai');
  const [page, setPage] = useState<number>(1);
  const [selectedStreamUrl, setSelectedStreamUrl] = useState<string | null>(null);

  // Fetch Hentai
  const {
    data: hentaiData,
    isLoading: isLoadingHentai,
    isError: isHentaiError,
  } = useQuery({
    queryKey: ['nsfwHentai', page],
    queryFn: () => nsfwApi.getLatestHentai(page),
    enabled: isUnlocked && activeTab === 'hentai',
  });

  // Fetch JAV/3D
  const {
    data: javData,
    isLoading: isLoadingJav,
    isError: isJavError,
  } = useQuery({
    queryKey: ['nsfwJav', page],
    queryFn: () => nsfwApi.getLatestJav(page),
    enabled: isUnlocked && activeTab === 'jav',
  });

  // Fetch Neko Releases
  const {
    data: releasesData,
    isLoading: isLoadingReleases,
    isError: isReleasesError,
  } = useQuery({
    queryKey: ['nsfwReleases', page],
    queryFn: () => nsfwApi.getNekoReleases(page),
    enabled: isUnlocked && activeTab === 'release',
  });

  // If locked, render the age gate barrier prompt
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-700/60 text-red-500 flex items-center justify-center mx-auto shadow-xl shadow-red-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            18+ Restricted Zone
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This module contains adult content (Hentai & JAV). Age verification is required to unlock access.
          </p>
        </div>

        <button
          onClick={onOpenAgeGate}
          className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 transition-colors"
        >
          Verify Age & Enter (18+)
        </button>

        <AgeGateModal
          isOpen={isAgeModalOpen}
          onConfirm={onConfirmAge}
          onCancel={onCancelAge}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'hentai', label: 'Latest Hentai' },
    { id: 'jav', label: 'JAV & 3D' },
    { id: 'release', label: 'Neko Releases' },
  ];

  const hentaiList = hentaiData?.data || [];
  const javList = javData?.data || [];
  const releasesList = releasesData?.result || [];

  const isLoading =
    activeTab === 'hentai'
      ? isLoadingHentai
      : activeTab === 'jav'
      ? isLoadingJav
      : isLoadingReleases;

  const isError =
    activeTab === 'hentai'
      ? isHentaiError
      : activeTab === 'jav'
      ? isJavError
      : isReleasesError;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-850 pb-6">
        <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          <span>Adult Vault (18+)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          Nekopoi & Hentai Streams
        </h1>
        <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
          Uncensored Japanese Hentai and JAV releases indexed from Nekopoi.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => {
          setActiveTab(id as 'hentai' | 'jav' | 'release');
          setPage(1);
        }}
      />

      {/* Stream Viewer Modal if selected */}
      {selectedStreamUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-semibold">Neko Stream Viewer</span>
              <button
                onClick={() => setSelectedStreamUrl(null)}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Close Player
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={selectedStreamUrl}
                title="Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                sandbox="allow-forms allow-scripts allow-same-origin allow-presentation"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Unable to load NSFW feed. Downstream source might be unreachable.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {activeTab === 'release'
              ? releasesList.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-red-600/60 transition-all"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                      {item.thumb ? (
                        <img
                          src={item.thumb}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Flame className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                      <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/40">
                        18+
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.uploadDate && (
                        <p className="text-[10px] text-zinc-500 mt-2">{item.uploadDate}</p>
                      )}
                    </div>
                  </div>
                ))
              : (activeTab === 'hentai' ? hentaiList : javList).map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 hover:border-red-600/60 transition-all"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                      {item.image || item.thumbnail ? (
                        <img
                          src={item.image || item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Flame className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                      <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-900/40">
                        {activeTab === 'hentai' ? 'Hentai' : 'JAV'}
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-semibold text-zinc-200 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>{item.views || 'HD'}</span>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 font-semibold text-[11px]"
                          >
                            Watch External
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-900">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="text-xs font-mono text-zinc-400 tabular-nums">
              Page {page}
            </span>

            <button
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs text-white flex items-center gap-1.5"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NsfwPage;
