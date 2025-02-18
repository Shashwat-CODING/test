import { create } from 'zustand';

export interface PodcastVideo {
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
  likedPodcasts: Set<string>;

  setCurrentVideo: (video: PodcastVideo | null) => void;
  addToQueue: (video: PodcastVideo) => void;
  removeFromQueue: (videoId: string) => void;
  playNext: () => void;
  clearQueue: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setMinimized: (minimized: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCreator: (creator: string | null) => void;
  setSleepTimer: (minutes: number | null) => void;
  toggleLike: (videoId: string) => void;
  isLiked: (videoId: string) => boolean;
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
  likedPodcasts: new Set(JSON.parse(localStorage.getItem('likedPodcasts') || '[]')),

  setCurrentVideo: (video) => {
    const state = get();
    if (state.audioInstance && video) {
      state.audioInstance.src = video.filePath;
      state.audioInstance.load();
      state.audioInstance.playbackRate = state.playbackSpeed;
      set({ currentVideo: video, isPlaying: true });
      state.audioInstance.play().catch((error) => {
        console.error('Error playing audio:', error);
        set({ isPlaying: false });
      });
    } else {
      set({ currentVideo: video });
    }
  },

  addToQueue: (video) => set(state => ({ queue: [...state.queue, video] })),

  removeFromQueue: (videoId) => set(state => ({
    queue: state.queue.filter(video => video.videoId !== videoId)
  })),

  playNext: () => {
    const state = get();
    if (state.queue.length > 0) {
      const [nextVideo, ...remainingQueue] = state.queue;
      set({ queue: remainingQueue });
      state.setCurrentVideo(nextVideo);
    }
  },

  clearQueue: () => set({ queue: [] }),

  setIsPlaying: (playing) => {
    const state = get();
    if (state.audioInstance) {
      if (playing) {
        state.audioInstance.play().catch(() => set({ isPlaying: false }));
      } else {
        state.audioInstance.pause();
      }
      set({ isPlaying: playing });
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

  toggleLike: (videoId) => set(state => {
    const newLikedPodcasts = new Set(state.likedPodcasts);
    if (newLikedPodcasts.has(videoId)) {
      newLikedPodcasts.delete(videoId);
    } else {
      newLikedPodcasts.add(videoId);
    }
    localStorage.setItem('likedPodcasts', JSON.stringify(Array.from(newLikedPodcasts)));
    return { likedPodcasts: newLikedPodcasts };
  }),

  isLiked: (videoId) => get().likedPodcasts.has(videoId),

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setMinimized: (minimized) => set({ minimized }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCreator: (creator) => set({ selectedCreator: creator }),

  initAudio: () => {
    if (!globalAudio) {
      globalAudio = new Audio();

      // Set up audio event listeners
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

      // Set up sleep timer checker
      const checkSleepTimer = setInterval(() => {
        const state = get();
        if (state.sleepTimerEndTime && Date.now() >= state.sleepTimerEndTime) {
          state.setIsPlaying(false);
          set({ sleepTimerEndTime: null });
        }
      }, 1000);

      // Clean up on unmount
      return () => {
        clearInterval(checkSleepTimer);
        if (globalAudio) {
          globalAudio.pause();
          globalAudio.src = '';
        }
      };
    }

    set({ audioInstance: globalAudio });
  }
}));