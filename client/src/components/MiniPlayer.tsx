import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDuration, extractThumbnailUrl } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { motion } from "framer-motion";
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

  const progressPercentage = (progress / currentVideo.lengthSeconds) * 100;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/60 border-t border-border/50 backdrop-blur-2xl shadow-lg overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = x / rect.width;
          seek(percentage * currentVideo.lengthSeconds);
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-primary/20 via-primary/25 to-primary/20 transition-all duration-150"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="container mx-auto relative">
        <div className="flex items-center h-16 px-4 gap-4">
          <div className="relative h-10 aspect-video flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
            <img
              src={extractThumbnailUrl(currentVideo.videoId)}
              alt={currentVideo.title}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-110"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center mr-4">
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground truncate">
                {currentVideo.author}
              </p>
              <h3 className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
                {currentVideo.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
              {formatDuration(progress)} / {formatDuration(currentVideo.lengthSeconds)}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMinimized(false)}
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}