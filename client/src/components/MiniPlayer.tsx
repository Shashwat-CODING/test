import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration, extractThumbnailUrl } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize2 } from "lucide-react";

export function MiniPlayer() {
  const {
    currentVideo,
    isPlaying,
    progress,
    minimized,
    setIsPlaying,
    setMinimized,
  } = useAudioStore();

  const { seek } = useAudioPlayer();

  if (!currentVideo) return null;

  if (!minimized) {
    return <AudioPlayer />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-background/40 border-t border-primary/10 backdrop-blur-xl shadow-lg"
      >
        <div className="relative">
          <Slider
            value={[progress]}
            max={currentVideo.lengthSeconds}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="absolute -top-2 left-0 right-0"
          />
          <div className="container mx-auto">
            <div className="flex items-center h-16 px-6 sm:px-4 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative h-10 aspect-video flex-shrink-0 overflow-hidden rounded-md shadow-lg group cursor-pointer"
                onClick={() => setMinimized(false)}
              >
                <img
                  src={extractThumbnailUrl(currentVideo.videoId)}
                  alt={currentVideo.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <div className="flex-1 min-w-0 flex flex-col justify-center mr-2 sm:mr-4">
                <div className="flex flex-col">
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground/80 font-medium truncate hover:text-primary/80 transition-colors cursor-pointer"
                    onClick={() => setMinimized(false)}
                  >
                    {currentVideo.author}
                  </motion.p>
                  <motion.h3 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setMinimized(false)}
                  >
                    {currentVideo.title}
                  </motion.h3>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <span className="text-xs text-muted-foreground/80 whitespace-nowrap hidden sm:inline font-medium">
                  {formatDuration(progress)} / {formatDuration(currentVideo.lengthSeconds)}
                </span>

                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMinimized(false)}
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}