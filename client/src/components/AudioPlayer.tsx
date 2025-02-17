import { useEffect } from "react";
import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration, extractThumbnailUrl } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Minimize2, X,
  Heart, Share2, ListMusic
} from "lucide-react";

export function AudioPlayer() {
  const {
    currentVideo,
    isPlaying,
    progress,
    setIsPlaying,
    setMinimized,
  } = useAudioStore();

  const { seek, skip } = useAudioPlayer();
  const thumbnailUrl = currentVideo ? extractThumbnailUrl(currentVideo.videoId) : '';

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
        className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/10 backdrop-blur-xl"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMinimized(true)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center px-8 py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMinimized(true)}
            className="hover:bg-white/10"
          >
            <Minimize2 className="h-6 w-6" />
          </Button>
          <div className="flex gap-6">
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Share2 className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <ListMusic className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 p-4 md:p-8 overflow-y-auto">
          {/* Thumbnail Section */}
          <motion.div 
            className="w-full md:w-2/5 max-w-lg flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                src={thumbnailUrl}
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Controls Section */}
          <div className="w-full md:w-2/5 max-w-lg flex flex-col justify-center gap-8">
            {/* Title and Author */}
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground line-clamp-2">
                {currentVideo.title}
              </h2>
              <p className="text-lg md:text-2xl text-muted-foreground/80">
                {currentVideo.author}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Slider
                  value={[progress]}
                  max={currentVideo.lengthSeconds}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />

                <div className="flex justify-between text-sm md:text-base text-muted-foreground/70 px-1">
                  <span>{formatDuration(progress)}</span>
                  <span>{formatDuration(currentVideo.lengthSeconds)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 md:gap-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(-15)}
                  className="h-14 w-14 md:h-16 md:w-16 hover:bg-white/10"
                >
                  <SkipBack className="h-7 w-7 md:h-8 md:w-8" />
                </Button>

                <Button
                  variant="default"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10 md:h-12 md:w-12 text-primary-foreground" />
                  ) : (
                    <Play className="h-10 w-10 md:h-12 md:w-12 ml-1 text-primary-foreground" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(15)}
                  className="h-14 w-14 md:h-16 md:w-16 hover:bg-white/10"
                >
                  <SkipForward className="h-7 w-7 md:h-8 md:w-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}