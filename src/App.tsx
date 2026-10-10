import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';

import { HomePage } from './pages/HomePage';
import { SchedulePage } from './pages/SchedulePage';
import { OngoingPage } from './pages/OngoingPage';
import { GenrePage } from './pages/GenrePage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { WatchPage } from './pages/WatchPage';
import { DonghuaPage } from './pages/DonghuaPage';
import { ComicHomePage } from './pages/ComicHomePage';
import { ComicDetailPage } from './pages/ComicDetailPage';
import { ComicReadPage } from './pages/ComicReadPage';
import { NsfwPage } from './pages/NsfwPage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';

import { useNsfwSafeGate } from './hooks/useNsfwSafeGate';

// Configure TanStack Query strictly per rate-limit requirements
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const {
    isUnlocked,
    isAgeModalOpen,
    triggerToggle,
    confirmUnlock,
    cancelUnlock,
  } = useNsfwSafeGate();

  const { pathname } = useLocation();
  const isReaderPage = pathname.startsWith('/comic/read/');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <ScrollToTop />
      <ToastContainer />

      {/* Render Navbar on all pages except full-immersion comic reader */}
      {!isReaderPage && (
        <Navbar
          isNsfwUnlocked={isUnlocked}
          onToggleNsfw={triggerToggle}
          isAgeModalOpen={isAgeModalOpen}
          onConfirmAge={confirmUnlock}
          onCancelAge={cancelUnlock}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/ongoing" element={<OngoingPage />} />
          <Route path="/genres" element={<GenrePage />} />
          <Route path="/genre/:slug" element={<GenrePage />} />
          <Route path="/anime/:slug" element={<AnimeDetailPage />} />
          <Route path="/watch/:slug" element={<WatchPage />} />
          <Route path="/donghua" element={<DonghuaPage />} />
          <Route path="/comic" element={<ComicHomePage />} />
          <Route path="/comic/:slug" element={<ComicDetailPage />} />
          <Route path="/comic/read/:slug" element={<ComicReadPage />} />
          <Route
            path="/nsfw"
            element={
              <NsfwPage
                isUnlocked={isUnlocked}
                onOpenAgeGate={triggerToggle}
                isAgeModalOpen={isAgeModalOpen}
                onConfirmAge={confirmUnlock}
                onCancelAge={cancelUnlock}
              />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer and Mobile Nav */}
      {!isReaderPage && <Footer />}
      {!isReaderPage && <MobileNav isNsfwUnlocked={isUnlocked} />}
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
