import { useState, useCallback } from 'react';

const NSFW_STORAGE_KEY = 'nsfw_unlocked';

export function useNsfwSafeGate() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(NSFW_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);

  const triggerToggle = useCallback(() => {
    if (isUnlocked) {
      setIsUnlocked(false);
      try {
        localStorage.setItem(NSFW_STORAGE_KEY, 'false');
      } catch {}
    } else {
      setIsAgeModalOpen(true);
    }
  }, [isUnlocked]);

  const confirmUnlock = useCallback(() => {
    setIsUnlocked(true);
    setIsAgeModalOpen(false);
    try {
      localStorage.setItem(NSFW_STORAGE_KEY, 'true');
    } catch {}
  }, []);

  const cancelUnlock = useCallback(() => {
    setIsAgeModalOpen(false);
  }, []);

  return {
    isUnlocked,
    isAgeModalOpen,
    triggerToggle,
    confirmUnlock,
    cancelUnlock,
  };
}
