import { useState, useEffect } from 'react';
import { subscribeToast } from '../../api/axiosClient';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info';
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToast((msg) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...msg, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none md:bottom-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-lg bg-zinc-900/95 border border-red-900/40 shadow-xl shadow-red-950/20 backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-zinc-100">{toast.title}</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-zinc-500 hover:text-zinc-200 p-1"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
