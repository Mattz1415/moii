import { useState, useCallback } from 'react';

export interface WatchHistoryItem {
  animeTitle: string;
  animeSlug: string;
  episodeTitle: string;
  episodeSlug: string;
  poster: string;
  timestamp: number;
}

export interface ReadingHistoryItem {
  comicTitle: string;
  comicSlug: string;
  chapterTitle: string;
  chapterSlug: string;
  thumbnail: string;
  scrollPercentage?: number;
  timestamp: number;
}

export interface BookmarkItem {
  id: string;
  title: string;
  slug: string;
  poster: string;
  type: 'anime' | 'comic' | 'donghua' | 'nsfw';
  timestamp: number;
}

const STORAGE_KEYS = {
  WATCH_HISTORY: 'sankaverse_watch_history_v1',
  READING_HISTORY: 'sankaverse_reading_history_v1',
  BOOKMARKS: 'sankaverse_bookmarks_v1',
};

function getInitialStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function useWatchHistory() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() =>
    getInitialStorage(STORAGE_KEYS.WATCH_HISTORY, [])
  );
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() =>
    getInitialStorage(STORAGE_KEYS.READING_HISTORY, [])
  );
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    getInitialStorage(STORAGE_KEYS.BOOKMARKS, [])
  );

  // Save watch history
  const logWatchEpisode = useCallback((item: Omit<WatchHistoryItem, 'timestamp'>) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((i) => i.animeSlug !== item.animeSlug);
      const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
      return updated;
    });
  }, []);

  // Save reading history
  const logReadingChapter = useCallback((item: Omit<ReadingHistoryItem, 'timestamp'>) => {
    setReadingHistory((prev) => {
      const filtered = prev.filter((i) => i.comicSlug !== item.comicSlug);
      const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 50);
      try {
        localStorage.setItem(STORAGE_KEYS.READING_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
      return updated;
    });
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((item: Omit<BookmarkItem, 'timestamp'>) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      let updated: BookmarkItem[];
      if (exists) {
        updated = prev.filter((b) => b.id !== item.id);
      } else {
        updated = [{ ...item, timestamp: Date.now() }, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks]
  );

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
    } catch {}
  }, []);

  const clearReadingHistory = useCallback(() => {
    setReadingHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.READING_HISTORY);
    } catch {}
  }, []);

  return {
    watchHistory,
    readingHistory,
    bookmarks,
    logWatchEpisode,
    logReadingChapter,
    toggleBookmark,
    isBookmarked,
    clearWatchHistory,
    clearReadingHistory,
  };
}
