import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutList, Layers, Maximize, RotateCcw, AlertCircle } from 'lucide-react';
import type { ChapterImageData } from '../../types/comic';

interface ChapterReaderProps {
  chapterTitle: string;
  images: ChapterImageData[];
  prevChapterSlug?: string | null;
  nextChapterSlug?: string | null;
  onNavigateChapter: (slug: string) => void;
  onProgressUpdate?: (percent: number) => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapterTitle,
  images = [],
  prevChapterSlug,
  nextChapterSlug,
  onNavigateChapter,
  onProgressUpdate,
}) => {
  const [viewMode, setViewMode] = useState<'webtoon' | 'paged'>('webtoon');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll in webtoon mode
  useEffect(() => {
    const handleScroll = () => {
      if (viewMode !== 'webtoon') return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
        onProgressUpdate?.(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, onProgressUpdate]);

  // Handle keyboard arrow keys for paged mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'paged') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          if (currentPage < images.length - 1) {
            setCurrentPage((p) => p + 1);
          } else if (nextChapterSlug) {
            onNavigateChapter(nextChapterSlug);
          }
        } else if (e.key === 'ArrowLeft') {
          if (currentPage > 0) {
            setCurrentPage((p) => p - 1);
          } else if (prevChapterSlug) {
            onNavigateChapter(prevChapterSlug);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentPage, images.length, nextChapterSlug, prevChapterSlug, onNavigateChapter]);

  const handleImageLoad = (idx: number) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const handleImageError = (idx: number) => {
    setFailedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-zinc-950 flex flex-col items-center">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <div
          className="h-full bg-cyan-400 transition-all duration-150 shadow-sm shadow-cyan-400/50"
          style={{
            width: `${viewMode === 'webtoon' ? scrollProgress : ((currentPage + 1) / images.length) * 100}%`,
          }}
        />
      </div>

      {/* Reader Control Header */}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-xs font-semibold text-zinc-100 truncate max-w-xs md:max-w-md">
            {chapterTitle}
          </h2>
          <span className="text-[11px] font-mono text-cyan-400 shrink-0">
            {viewMode === 'webtoon'
              ? `${Math.round(scrollProgress)}%`
              : `Page ${currentPage + 1} / ${images.length}`}
          </span>
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setViewMode('webtoon')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                viewMode === 'webtoon'
                  ? 'bg-zinc-800 text-cyan-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Continuous Webtoon Scroll"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cascade</span>
            </button>
            <button
              onClick={() => setViewMode('paged')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                viewMode === 'paged'
                  ? 'bg-zinc-800 text-cyan-400'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Single Paged Mode"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paged</span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Reader Images Canvas */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center">
        {images.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 text-xs">
            Loading chapter images...
          </div>
        ) : viewMode === 'webtoon' ? (
          /* Continuous Cascade Webtoon View */
          <div className="w-full flex flex-col items-center">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-full min-h-[400px] bg-zinc-950 flex flex-col items-center">
                {!loadedImages[idx] && !failedImages[idx] && (
                  <div className="w-full h-96 flex flex-col items-center justify-center bg-zinc-900/60 animate-pulse text-zinc-600 text-xs font-mono">
                    Loading Panel {idx + 1}...
                  </div>
                )}

                {failedImages[idx] ? (
                  <div className="w-full py-16 flex flex-col items-center justify-center bg-zinc-900/80 border border-zinc-800 p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-xs text-zinc-400 mb-3">Panel {idx + 1} failed to load.</p>
                    <button
                      onClick={() => {
                        setFailedImages((prev) => ({ ...prev, [idx]: false }));
                      }}
                      className="px-3 py-1.5 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Panel
                    </button>
                  </div>
                ) : (
                  <img
                    src={img.url}
                    alt={`Panel ${idx + 1}`}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                    onLoad={() => handleImageLoad(idx)}
                    onError={() => handleImageError(idx)}
                    className={`w-full max-w-full h-auto block select-none ${
                      loadedImages[idx] ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-300`}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Single Paged Mode */
          <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
            <div className="relative max-w-full flex flex-col items-center">
              <img
                src={images[currentPage]?.url}
                alt={`Page ${currentPage + 1}`}
                referrerPolicy="no-referrer"
                onLoad={() => handleImageLoad(currentPage)}
                className="max-h-[85vh] w-auto object-contain rounded shadow-2xl select-none"
              />

              {/* Paged Navigation Stepper */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  disabled={currentPage === 0 && !prevChapterSlug}
                  onClick={() => {
                    if (currentPage > 0) setCurrentPage((p) => p - 1);
                    else if (prevChapterSlug) onNavigateChapter(prevChapterSlug);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs text-zinc-300 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-zinc-400 px-3">
                  {currentPage + 1} of {images.length}
                </span>

                <button
                  disabled={currentPage === images.length - 1 && !nextChapterSlug}
                  onClick={() => {
                    if (currentPage < images.length - 1) setCurrentPage((p) => p + 1);
                    else if (nextChapterSlug) onNavigateChapter(nextChapterSlug);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-xs text-white flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Chapter Switcher Navigation */}
      <footer className="w-full max-w-3xl border-t border-zinc-800/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-zinc-950">
        <button
          disabled={!prevChapterSlug}
          onClick={() => prevChapterSlug && onNavigateChapter(prevChapterSlug)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
            prevChapterSlug
              ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
              : 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <span className="text-xs text-zinc-500 font-mono text-center">
          {images.length} Panels Read
        </span>

        <button
          disabled={!nextChapterSlug}
          onClick={() => nextChapterSlug && onNavigateChapter(nextChapterSlug)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-colors ${
            nextChapterSlug
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950/40'
              : 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed'
          }`}
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
