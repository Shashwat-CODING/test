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
  colors: {
    background: string;
    foreground: string;
    accent: string;
  };
  audioInstance: HTMLAudioElement | null;
  setCurrentVideo: (video: PodcastVideo | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setMinimized: (minimized: boolean) => void;
  setColors: (colors: { background: string; foreground: string; accent: string }) => void;
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
  colors: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 0%)',
    accent: 'hsl(250 95% 60%)'
  },
  audioInstance: null,
  setCurrentVideo: (video) => {
    const state = get();
    if (state.audioInstance && video) {
      state.audioInstance.src = video.filePath;
      state.audioInstance.load();
      state.audioInstance.play();
    }
    set({ currentVideo: video, isPlaying: true });
  },
  setIsPlaying: (playing) => {
    const state = get();
    if (state.audioInstance) {
      if (playing) {
        state.audioInstance.play();
      } else {
        state.audioInstance.pause();
      }
    }
    set({ isPlaying: playing });
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
  setColors: (colors) => set({ colors }),
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