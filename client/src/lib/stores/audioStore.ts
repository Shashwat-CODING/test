import { writable, derived } from 'svelte/store';

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

interface AudioState {
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
}

function createAudioStore() {
  const { subscribe, set, update } = writable<AudioState>({
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
    likedPodcasts: new Set<string>()
  });

  // Load liked podcasts from localStorage
  const loadLikedPodcasts = (): Set<string> => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likedPodcasts');
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  };

  // Initialize audio instance
  let globalAudio: HTMLAudioElement | null = null;

  return {
    subscribe,
    setCurrentVideo: (video: PodcastVideo | null) => update((state: AudioState) => {
      if (state.audioInstance && video) {
        state.audioInstance.src = video.filePath;
        state.audioInstance.load();
        state.audioInstance.playbackRate = state.playbackSpeed;
        try {
          state.audioInstance.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      return { ...state, currentVideo: video, isPlaying: !!video };
    }),

    addToQueue: (video: PodcastVideo) => update((state: AudioState) => ({
      ...state,
      queue: [...state.queue, video]
    })),

    removeFromQueue: (videoId: string) => update((state: AudioState) => ({
      ...state,
      queue: state.queue.filter((video: PodcastVideo) => video.videoId !== videoId)
    })),

    setIsPlaying: (playing: boolean) => update((state: AudioState) => {
      if (state.audioInstance) {
        try {
          if (playing) {
            state.audioInstance.play();
          } else {
            state.audioInstance.pause();
          }
        } catch (error) {
          console.error('Error toggling playback:', error);
          playing = false;
        }
      }
      return { ...state, isPlaying: playing };
    }),

    toggleLike: (videoId: string) => update((state: AudioState) => {
      const newLikedPodcasts = new Set(state.likedPodcasts);
      if (newLikedPodcasts.has(videoId)) {
        newLikedPodcasts.delete(videoId);
      } else {
        newLikedPodcasts.add(videoId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedPodcasts', JSON.stringify(Array.from(newLikedPodcasts)));
      }
      return { ...state, likedPodcasts: newLikedPodcasts };
    }),

    initAudio: () => update((state: AudioState) => {
      if (!globalAudio && typeof window !== 'undefined') {
        globalAudio = new Audio();
        globalAudio.addEventListener('timeupdate', () => {
          update((s: AudioState) => ({ ...s, progress: globalAudio?.currentTime || 0 }));
        });
        globalAudio.addEventListener('loadedmetadata', () => {
          update((s: AudioState) => ({ ...s, duration: globalAudio?.duration || 0 }));
        });
        globalAudio.addEventListener('ended', () => {
          update((s: AudioState) => {
            if (s.queue.length > 0) {
              const [nextVideo, ...remainingQueue] = s.queue;
              if (s.audioInstance) {
                s.audioInstance.src = nextVideo.filePath;
                s.audioInstance.load();
                s.audioInstance.play();
              }
              return {
                ...s,
                currentVideo: nextVideo,
                queue: remainingQueue,
                isPlaying: true
              };
            }
            return { ...s, isPlaying: false };
          });
        });
      }
      return { 
        ...state, 
        audioInstance: globalAudio, 
        likedPodcasts: loadLikedPodcasts() 
      };
    })
  };
}

export const audioStore = createAudioStore();