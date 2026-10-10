import React, { useState, useMemo } from 'react';
import { Loader2, Server, Maximize2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, List, ExternalLink } from 'lucide-react';
import { animeApi } from '../../api/animeApi';
import type { StreamQuality } from '../../types/anime';

interface DesuStreamPlayerProps {
  initialStreamUrl?: string;
  serverQualities?: StreamQuality[];
  title: string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
  onOpenEpisodeDrawer?: () => void;
}

export const DesuStreamPlayer: React.FC<DesuStreamPlayerProps> = ({
  initialStreamUrl,
  serverQualities = [],
  title,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode,
  hasPrevEpisode,
  onOpenEpisodeDrawer,
}) => {
  const [overrideUrl, setOverrideUrl] = useState<string | null>(null);
  const [prevInitialUrl, setPrevInitialUrl] = useState<string | undefined>(initialStreamUrl);
  const [userQuality, setUserQuality] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(false);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // Sync when initialStreamUrl changes (e.g. next/prev episode clicked)
  if (initialStreamUrl !== prevInitialUrl) {
    setPrevInitialUrl(initialStreamUrl);
    setOverrideUrl(null);
    setIsIframeLoading(true);
    setHasError(false);
  }

  const defaultQuality = serverQualities.find((q) => q.title.includes('720p'))?.title ||
    serverQualities.find((q) => q.title.includes('480p'))?.title ||
    serverQualities[0]?.title || '';

  const activeQuality = userQuality || defaultQuality;
  const currentUrl = overrideUrl || initialStreamUrl || '';

  // Proxy all external stream URLs through /api/embed to bypass both
  // CSP frame-ancestors blocks (DesuStream) and sandboxed iframe blocks (Vidhide)
  const resolvedEmbedUrl = useMemo(() => {
    if (!currentUrl) return '';
    if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
      return `/api/embed?url=${encodeURIComponent(currentUrl)}`;
    }
    return currentUrl;
  }, [currentUrl]);

  const handleSelectServer = async (serverId: string, qualityTitle: string) => {
    try {
      setIsLoadingServer(true);
      setSelectedServerId(serverId);
      setUserQuality(qualityTitle);
      setIsIframeLoading(true);
      setHasError(false);

      const res = await animeApi.getServerUrl(serverId);
      if (res?.data?.url) {
        setOverrideUrl(res.data.url);
      } else {
        setHasError(true);
      }
    } catch (e) {
      console.error('Failed to resolve server URL:', e);
      setHasError(true);
    } finally {
      setIsLoadingServer(false);
    }
  };

  const currentQualityObj = serverQualities.find((q) => q.title === activeQuality);

  return (
    <div className={`w-full flex flex-col ${isTheaterMode ? 'fixed inset-0 z-50 bg-black/95 p-4 overflow-y-auto' : ''}`}>
      {/* Player Header in Theater mode */}
      {isTheaterMode && (
        <div className="flex items-center justify-between pb-3 text-zinc-200">
          <h2 className="text-sm font-semibold truncate">{title}</h2>
          <button
            onClick={() => setIsTheaterMode(false)}
            className="text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Exit Theater Mode
          </button>
        </div>
      )}

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl shadow-red-950/20 group">
        {/* Iframe Loading Spinner */}
        {(isIframeLoading || isLoadingServer) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-none">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-2" />
            <span className="text-xs font-mono text-zinc-300 tracking-wider">
              {isLoadingServer ? 'Connecting to Stream Node...' : 'Buffering Stream Player...'}
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/95">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h4 className="text-sm font-semibold text-zinc-200 mb-1">
              Stream Node Unavailable
            </h4>
            <p className="text-xs text-zinc-400 max-w-md mb-4">
              The selected mirror server timed out or blocked embedding. Please switch to another resolution or backup server below.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setOverrideUrl(null);
                  setHasError(false);
                  setIsIframeLoading(true);
                }}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Stream
              </button>
              {currentUrl && (
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in New Tab
                </a>
              )}
            </div>
          </div>
        ) : (
          /* Responsive Iframe Embed without sandboxing restrictions */
          resolvedEmbedUrl && (
            <iframe
              src={resolvedEmbedUrl}
              title={title}
              onLoad={() => setIsIframeLoading(false)}
              onError={() => {
                setIsIframeLoading(false);
                setHasError(true);
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
            />
          )
        )}
      </div>

      {/* Control Bar & Navigation Toolbar */}
      <div className="mt-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Episode Stepper Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevEpisode}
            disabled={!hasPrevEpisode}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
              hasPrevEpisode
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Episode</span>
          </button>

          <button
            onClick={onNextEpisode}
            disabled={!hasNextEpisode}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
              hasNextEpisode
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-950/40'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span>Next Episode</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {onOpenEpisodeDrawer && (
            <button
              onClick={onOpenEpisodeDrawer}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <List className="w-4 h-4 text-cyan-400" />
              <span>Episodes</span>
            </button>
          )}
        </div>

        {/* External Link & Theater Mode */}
        <div className="flex items-center gap-2">
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              title="Open Stream Mirror in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
          )}

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
            aria-label="Theater Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Server Switcher Grid */}
      {serverQualities.length > 0 && (
        <div className="mt-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-zinc-300">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>STREAM SERVERS & QUALITY NODES</span>
          </div>

          <div className="space-y-3">
            {/* Resolution Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {serverQualities.map((quality) => (
                <button
                  key={quality.title}
                  onClick={() => {
                    setUserQuality(quality.title);
                    if (quality.serverList.length > 0) {
                      handleSelectServer(quality.serverList[0].serverId, quality.title);
                    }
                  }}
                  className={`px-3.5 py-2 sm:py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    activeQuality === quality.title
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  {quality.title}
                </button>
              ))}
            </div>

            {/* Mirror Servers for Selected Quality */}
            {currentQualityObj && (
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/50">
                <span className="text-[11px] text-zinc-500 font-mono">Mirrors:</span>
                {currentQualityObj.serverList.map((srv) => {
                  const isActive = selectedServerId === srv.serverId;
                  return (
                    <button
                      key={srv.serverId}
                      disabled={isLoadingServer}
                      onClick={() => handleSelectServer(srv.serverId, currentQualityObj.title)}
                      className={`px-3.5 py-2 sm:py-1.5 text-xs font-semibold rounded-lg uppercase transition-all ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {srv.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
