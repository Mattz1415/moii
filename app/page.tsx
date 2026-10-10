'use client';

import dynamic from 'next/dynamic';

const SankaVerseApp = dynamic(() => import('@/src/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
      <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-xs font-mono tracking-wider text-zinc-300">
        INITIALIZING SANKAVERSE...
      </span>
    </div>
  ),
});

export default function Page() {
  return <SankaVerseApp />;
}
