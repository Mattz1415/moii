import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle, BookOpen } from 'lucide-react';
import { comicApi } from '../api/comicApi';
import { ChapterReader } from '../components/reader/ChapterReader';
import { useWatchHistory } from '../hooks/useWatchHistory';

export const ComicReadPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { logReadingChapter } = useWatchHistory();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['comicChapter', slug],
    queryFn: () => comicApi.getChapter(slug || ''),
    enabled: !!slug,
  });

  const chapterData = data?.data;
  const images = chapterData?.images || [];

  // Infer comic slug from chapter slug or komikInfo
  // E.g. student-jo-eun-chapter-56 -> student-jo-eun
  const parentComicSlug =
    chapterData?.komikInfo?.slug ||
    (slug ? slug.replace(/-chapter-.*$/i, '') : '');

  // Log reading progress
  useEffect(() => {
    if (chapterData && slug) {
      logReadingChapter({
        comicTitle: chapterData.komikInfo?.title || chapterData.title.replace(/^Komik\s+/i, ''),
        comicSlug: parentComicSlug,
        chapterTitle: chapterData.title.replace(/^Komik\s+/i, ''),
        chapterSlug: slug,
        thumbnail: chapterData.thumbnail || '',
      });
    }
  }, [chapterData, slug, parentComicSlug, logReadingChapter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400">Loading chapter panels...</p>
      </div>
    );
  }

  if (isError || !chapterData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-base font-bold text-zinc-100">Chapter Failed to Load</h2>
        <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
          The requested chapter images might be unavailable or server is rate-limited.
        </p>
        <Link
          to={parentComicSlug ? `/comic/${parentComicSlug}` : '/comic'}
          className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Comic Details</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top back strip */}
      <div className="w-full bg-zinc-950 border-b border-zinc-900 px-4 py-2 flex items-center justify-between text-xs">
        <Link
          to={`/comic/${parentComicSlug}`}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Title</span>
        </Link>

        <span className="text-[11px] font-mono text-zinc-500">
          Source: Komikindo CDN
        </span>
      </div>

      <ChapterReader
        chapterTitle={chapterData.title.replace(/^Komik\s+/i, '')}
        images={images}
        prevChapterSlug={chapterData.navigation?.prev}
        nextChapterSlug={chapterData.navigation?.next}
        onNavigateChapter={(nextSlug) => navigate(`/comic/read/${nextSlug}`)}
      />
    </div>
  );
};

export default ComicReadPage;
