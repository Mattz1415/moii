import React, { useEffect } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="w-full max-w-md bg-zinc-950 border border-red-800/80 rounded-xl p-6 shadow-2xl shadow-red-950/40 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-700/50 text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 id="age-gate-title" className="text-base font-semibold text-zinc-100">
                Adult Content Confirmation
              </h3>
              <p className="text-xs text-red-400 font-mono">18+ RESTRICTED ZONE</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-zinc-200 p-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              This section contains uncensored, sexually explicit material (Hentai, JAV, Doujinshi).
              You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to proceed.
            </p>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            By clicking <strong className="text-zinc-200 font-medium">I Am 18 or Older</strong>, you confirm your age and consent to viewing adult-oriented content. You can toggle this mode off at any time from the top navigation.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Cancel / Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-950/30 transition-colors"
          >
            I Am 18 or Older (Unlock)
          </button>
        </div>
      </div>
    </div>
  );
};
