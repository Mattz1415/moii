import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Play, AlertCircle } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { Tabs } from '../components/ui/Tabs';

export const DonghuaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'ongoing'>('latest');

  const { data: homeData, isLoading: isLoadingHome, isError: isHomeError } = useQuery({
    queryKey: ['donghuaHome'],
    queryFn: () => animeApi.getDonghuaHome(),
  });

  const { data: ongoingData, isLoading: isLoadingOngoing, isError: isOngoingError } = useQuery({
    queryKey: ['donghuaOngoing'],
    queryFn: () => animeApi.getDonghuaOngoing(),
  });

  const latestList = homeData?.latest_release || [];
  const ongoingList = ongoingData?.ongoing || [];

  const tabs = [
    { id: 'latest', label: 'Latest Episodes', count: latestList.length },
    { id: 'ongoing', label: 'Ongoing Series', count: ongoingList.length },
  ];

  const currentList = activeTab === 'latest' ? latestList : ongoingList;
  const isLoading = activeTab === 'latest' ? isLoadingHome : isLoadingOngoing;
  const isError = activeTab === 'latest' ? isHomeError : isOngoingError;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-zinc-850 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Chinese Animation Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          Donghua Releases & Simulcasts
        </h1>
        <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
          Stream Chinese 3D & 2D anime series with Indonesian subtitles from Anichin.
        </p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'latest' | 'ongoing')}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Failed to load Donghua feed from server.</p>
        </div>
      ) : currentList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentList.map((item) => (
            <AnimeCard
              key={item.slug}
              title={item.title}
              poster={item.poster}
              slug={item.slug}
              badgeText="Donghua"
              type="Donghua"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500">
          No Donghua series found in this tab.
        </div>
      )}
    </div>
  );
};

export default DonghuaPage;
