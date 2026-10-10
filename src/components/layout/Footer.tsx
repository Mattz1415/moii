import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 mt-20 pb-20 md:pb-8 pt-10 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-sm inline-block" />
              <span className="font-bold text-zinc-300 uppercase tracking-wider">SankaVerse</span>
            </div>
            <p className="text-zinc-500 text-[11px] max-w-sm">
              Cyberpunk anime and comic portal indexing Otakudesu, Anichin, Komikindo, and Nekopoi streams.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-zinc-400">
            <Link to="/" className="hover:text-zinc-200 transition-colors">Anime</Link>
            <Link to="/schedule" className="hover:text-zinc-200 transition-colors">Schedule</Link>
            <Link to="/ongoing" className="hover:text-zinc-200 transition-colors">Ongoing</Link>
            <Link to="/donghua" className="hover:text-zinc-200 transition-colors">Donghua</Link>
            <Link to="/comic" className="hover:text-zinc-200 transition-colors">Comics</Link>
            <Link to="/library" className="hover:text-zinc-200 transition-colors">Library</Link>
            <a
              href="https://github.com/SankaVollereii/Rest-Api-Anime-and-Comic"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors font-mono"
            >
              API Source
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} SankaVerse. Non-profit educational viewer.</p>
          <p className="text-center sm:text-right">Content rights belong to respective authors and production studios.</p>
        </div>
      </div>
    </footer>
  );
};
