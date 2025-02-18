import { create } from 'zustand';

interface BackgroundStore {
  thumbnailUrl: string | null;
  setThumbnailUrl: (url: string | null) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set) => ({
  thumbnailUrl: null,
  setThumbnailUrl: (url) => set({ thumbnailUrl: url }),
}));
