import { useEffect } from "react";
import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration, extractThumbnailUrl } from "@/lib/utils";
import { useColorThief } from "@/hooks/useColorThief";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Minimize2, X,
  Heart, Share2, ListMusic
} from "lucide-react";

export function AudioPlayer() {
  const {
    currentVideo,
    isPlaying,
    volume,
    progress,
    setIsPlaying,
    setVolume,
    setMinimized,
    setColors,
    colors
  } = useAudioStore();

  const { seek, skip } = useAudioPlayer();
  const thumbnailUrl = currentVideo ? extractThumbnailUrl(currentVideo.videoId) : '';
  const extractedColors = useColorThief(thumbnailUrl);

  useEffect(() => {
    setColors(extractedColors);
  }, [extractedColors, setColors]);

  if (!currentVideo) return null;

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
        style={{ 
          backgroundColor: `${colors.background}cc`,
          color: colors.foreground
        }}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMinimized(true)}
          className="absolute right-4 top-4 md:hidden z-10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative w-full max-w-4xl mx-auto p-6">
          {/* Desktop Top Controls */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMinimized(true)}
            >
              <Minimize2 className="h-6 w-6" />
            </Button>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <ListMusic className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8 items-center mt-8 md:mt-0">
            <div className="md:w-1/2">
              <motion.img
                src={thumbnailUrl}
                alt={currentVideo.title}
                className="w-full aspect-square object-cover rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="md:w-1/2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                <p className="text-lg opacity-80">{currentVideo.author}</p>
              </div>

              {/* Playback Controls */}
              <div className="space-y-6">
                <Slider
                  value={[progress]}
                  max={currentVideo.lengthSeconds}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />

                <div className="flex justify-between text-sm opacity-80">
                  <span>{formatDuration(progress)}</span>
                  <span>{formatDuration(currentVideo.lengthSeconds)}</span>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(-15)}
                    className="h-12 w-12"
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-16 w-16 rounded-full"
                    style={{ 
                      backgroundColor: `${colors.accent}ee`,
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(15)}
                    className="h-12 w-12"
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVolume(volume === 0 ? 1 : 0)}
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </Button>
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}