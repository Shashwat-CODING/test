import { useEffect } from 'react';
import { useAudioStore } from '@/lib/store';

export function useAudioPlayer() {
  const { audioInstance, initAudio, isPlaying, volume, setProgress, setDuration, setIsPlaying } = useAudioStore();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  useEffect(() => {
    if (audioInstance) {
      audioInstance.volume = volume;
    }
  }, [volume, audioInstance]);

  useEffect(() => {
    const audio = audioInstance;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioInstance, setProgress, setDuration, setIsPlaying]);

  const seek = (time: number) => {
    if (audioInstance) {
      audioInstance.currentTime = time;
      setProgress(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioInstance) {
      const newTime = audioInstance.currentTime + seconds;
      seek(Math.max(0, Math.min(newTime, audioInstance.duration)));
    }
  };

  return {
    seek,
    skip
  };
}