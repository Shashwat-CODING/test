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
  queue: PodcastVideo[];
  playbackSpeed: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  minimized: boolean;
  searchQuery: string;
  selectedCreator: string | null;
  audioInstance: HTMLAudioElement | null;
  sleepTimerEndTime: number | null;

  // Video Management
  setCurrentVideo: (video: PodcastVideo | null) => void;
  addToQueue: (video: PodcastVideo) => void;
  removeFromQueue: (videoId: string) => void;
  playNext: () => void;
  clearQueue: () => void;

  // Playback Controls
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackSpeed: (speed: number) => void;

  // UI State
  setMinimized: (minimized: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCreator: (creator: string | null) => void;

  // Timer
  setSleepTimer: (minutes: number | null) => void;

  // Initialize
  initAudio: () => void;
}

// Create a single audio instance
let globalAudio: HTMLAudioElement | null = null;

export const useAudioStore = create<AudioPlayerState>((set, get) => ({
  currentVideo: null,
  queue: [],
  playbackSpeed: 1,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  minimized: true,
  searchQuery: '',
  selectedCreator: null,
  audioInstance: null,
  sleepTimerEndTime: null,

  setCurrentVideo: async (video) => {
    const state = get();
    if (state.audioInstance && video) {
      state.audioInstance.src = video.filePath;
      state.audioInstance.load();
      state.audioInstance.playbackRate = state.playbackSpeed;
      set({ currentVideo: video, isPlaying: true });
      try {
        await state.audioInstance.play();
      } catch (error) {
        set({ isPlaying: false });
      }
    } else {
      set({ currentVideo: video });
    }
  },

  addToQueue: (video) => {
    const { queue } = get();
    set({ queue: [...queue, video] });
  },

  removeFromQueue: (videoId) => {
    const { queue } = get();
    set({ queue: queue.filter(video => video.videoId !== videoId) });
  },

  playNext: () => {
    const { queue, setCurrentVideo } = get();
    if (queue.length > 0) {
      const nextVideo = queue[0];
      const newQueue = queue.slice(1);
      set({ queue: newQueue });
      setCurrentVideo(nextVideo);
    }
  },

  clearQueue: () => set({ queue: [] }),

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

  setPlaybackSpeed: (speed) => {
    const state = get();
    if (state.audioInstance) {
      state.audioInstance.playbackRate = speed;
    }
    set({ playbackSpeed: speed });
  },

  setSleepTimer: (minutes) => {
    if (minutes === null) {
      set({ sleepTimerEndTime: null });
    } else {
      const endTime = Date.now() + minutes * 60 * 1000;
      set({ sleepTimerEndTime: endTime });
    }
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
        const state = get();
        if (state.queue.length > 0) {
          state.playNext();
        } else {
          set({ isPlaying: false });
        }
      });
    }
    set({ audioInstance: globalAudio });

    // Check sleep timer
    const checkSleepTimer = setInterval(() => {
      const state = get();
      if (state.sleepTimerEndTime && Date.now() >= state.sleepTimerEndTime) {
        state.setIsPlaying(false);
        set({ sleepTimerEndTime: null });
      }
    }, 1000);

    return () => clearInterval(checkSleepTimer);
  }
}));

export type { PodcastVideo };