import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Film, ArrowLeft, AlertCircle, Info, Clock, Download } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { DesuStreamPlayer } from '../components/player/DesuStreamPlayer';
import { EpisodeListDrawer } from '../components/player/EpisodeListDrawer';
import { DownloadAccordion } from '../components/player/DownloadAccordion';
import { useWatchHistory } from '../hooks/useWatchHistory';

export const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isEpisodeDrawerOpen, setIsEpisodeDrawerOpen] = useState(false);

  const { logWatchEpisode } = useWatchHistory();

  // Fetch episode stream details
  const {
    data: episodeData,
    isLoading: isLoadingEpisode,
    isError: isEpisodeError,
  } = useQuery({
    queryKey: ['animeEpisode', slug],
    queryFn: () => animeApi.getEpisode(slug || ''),
    enabled: !!slug,
  });

  const episode = episodeData?.data;

  // Fetch parent anime details to obtain complete episode list & poster for drawer & sync
  const parentAnimeId = episode?.animeId;
  const { data: parentAnimeData } = useQuery({
    queryKey: ['animeDetail', parentAnimeId],
    queryFn: () => animeApi.getAnimeDetail(parentAnimeId || ''),
    enabled: !!parentAnimeId,
  });

  const animeDetail = parentAnimeData?.data;
  const fullEpisodeList = animeDetail?.episodeList || [];

  // Log to Watch History when episode loads
  useEffect(() => {
    if (episode && slug) {
      logWatchEpisode({
        animeTitle: animeDetail?.title || episode.title,
        animeSlug: episode.animeId || slug,
        episodeTitle: episode.title,
        episodeSlug: slug,
        poster: animeDetail?.poster || '',
      });
    }
  }, [episode, slug, animeDetail, logWatchEpisode]);

  if (isLoadingEpisode) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="w-full aspect-video bg-zinc-900 rounded-xl" />
        <div className="h-6 bg-zinc-900 rounded w-1/2" />
      </div>
    );
  }

  if (isEpisodeError || !episode) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-100">Episode Stream Unavailable</h2>
        <p className="text-xs text-zinc-400">
          This episode mirror could not be reached or has expired.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
        >
          Return to Anime Hub
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (episode.nextEpisode?.episodeId) {
      navigate(`/watch/${episode.nextEpisode.episodeId}`);
    }
  };

  const handlePrev = () => {
    if (episode.prevEpisode?.episodeId) {
      navigate(`/watch/${episode.prevEpisode.episodeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <Link
            to={episode.animeId ? `/anime/${episode.animeId}` : '/'}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Series Info</span>
          </Link>

          <span className="text-zinc-500 font-mono text-[11px] truncate">
            Node: DesuStream CDN
          </span>
        </div>

        {/* Streaming Theater (Responsive 16:9 Iframe Player) */}
        <section className="space-y-4">
          <DesuStreamPlayer
            initialStreamUrl={episode.defaultStreamingUrl}
            serverQualities={episode.server?.qualities || []}
            title={episode.title}
            onNextEpisode={handleNext}
            onPrevEpisode={handlePrev}
            hasNextEpisode={!!episode.hasNextEpisode && !!episode.nextEpisode}
            hasPrevEpisode={!!episode.hasPrevEpisode && !!episode.prevEpisode}
            onOpenEpisodeDrawer={() => setIsEpisodeDrawerOpen(true)}
          />
        </section>

        {/* Episode Title & Metadata Strip */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
                {episode.title}
              </h1>
              {animeDetail && (
                <Link
                  to={`/anime/${episode.animeId}`}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  {animeDetail.title}
                </Link>
              )}
            </div>

            {episode.releaseTime && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono shrink-0">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{episode.releaseTime}</span>
              </div>
            )}
          </div>

          {/* Episode Info Tags */}
          {episode.info && (
            <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap gap-3 text-[11px] text-zinc-400">
              {episode.info.credit && (
                <span>Credit: <strong className="text-zinc-200">{episode.info.credit}</strong></span>
              )}
              {episode.info.encoder && (
                <span>Encoder: <strong className="text-zinc-200">{episode.info.encoder}</strong></span>
              )}
              {episode.info.duration && (
                <span>Duration: <strong className="text-zinc-200">{episode.info.duration}</strong></span>
              )}
            </div>
          )}
        </div>

        {/* Direct Download Accordion */}
        {episode.downloadUrl?.qualities && episode.downloadUrl.qualities.length > 0 && (
          <section>
            <DownloadAccordion qualities={episode.downloadUrl.qualities} />
          </section>
        )}

        {/* Quick Episode Selector Strip */}
        {fullEpisodeList.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase">
                  Series Episodes ({fullEpisodeList.length})
                </h3>
              </div>
              <button
                onClick={() => setIsEpisodeDrawerOpen(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View Full List
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {fullEpisodeList.map((ep) => {
                const isCurrent = ep.episodeId === slug;
                return (
                  <button
                    key={ep.episodeId}
                    onClick={() => navigate(`/watch/${ep.episodeId}`)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    Ep {ep.eps || '•'}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Episode Drawer Modal */}
      <EpisodeListDrawer
        isOpen={isEpisodeDrawerOpen}
        onClose={() => setIsEpisodeDrawerOpen(false)}
        episodes={fullEpisodeList}
        currentEpisodeId={slug || ''}
        onSelectEpisode={(epId) => navigate(`/watch/${epId}`)}
      />
    </div>
  );
};

export default WatchPage;
