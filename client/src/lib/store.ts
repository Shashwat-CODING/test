import { create } from 'zustand';

interface PodcastVideo {
  videoId: string;
  title: string;
  description: string;
  filePath: string;
  published: number;
  publishedText: string;
  viewCount: number;
  lengthSeconds: number;
  liveNow: boolean;
  author: string;
}

interface AudioPlayerState {
  currentVideo: PodcastVideo | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  minimized: boolean;
  searchQuery: string;
  selectedCreator: string | null;
  audioInstance: HTMLAudioElement | null;
  setCurrentVideo: (video: PodcastVideo | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setMinimized: (minimized: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCreator: (creator: string | null) => void;
  initAudio: () => void;
}

// Create a single audio instance
let globalAudio: HTMLAudioElement | null = null;

export const useAudioStore = create<AudioPlayerState>((set, get) => ({
  currentVideo: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  minimized: true,
  searchQuery: '',
  selectedCreator: null,
  audioInstance: null,
  setCurrentVideo: async (video) => {
    const state = get();
    if (state.audioInstance && video) {
      state.audioInstance.src = video.filePath;
      state.audioInstance.load();
      set({ currentVideo: video, isPlaying: true });
      try {
        await state.audioInstance.play();
      } catch (error) {
        // If autoplay fails, we'll let the user manually start playback
        set({ isPlaying: false });
      }
    } else {
      set({ currentVideo: video });
    }
  },
  setIsPlaying: async (playing) => {
    const state = get();
    if (state.audioInstance) {
      try {
        if (playing) {
          await state.audioInstance.play();
          set({ isPlaying: true });
        } else {
          state.audioInstance.pause();
          set({ isPlaying: false });
        }
      } catch (error) {
        set({ isPlaying: false });
      }
    }
  },
  setVolume: (volume) => {
    const state = get();
    if (state.audioInstance) {
      state.audioInstance.volume = volume;
    }
    set({ volume });
  },
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setMinimized: (minimized) => set({ minimized }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCreator: (creator) => set({ selectedCreator: creator }),
  initAudio: () => {
    if (!globalAudio) {
      globalAudio = new Audio();
      globalAudio.addEventListener('timeupdate', () => {
        set({ progress: globalAudio?.currentTime || 0 });
      });
      globalAudio.addEventListener('loadedmetadata', () => {
        set({ duration: globalAudio?.duration || 0 });
      });
      globalAudio.addEventListener('ended', () => {
        set({ isPlaying: false });
      });
    }
    set({ audioInstance: globalAudio });
  }
}));

export type { PodcastVideo };