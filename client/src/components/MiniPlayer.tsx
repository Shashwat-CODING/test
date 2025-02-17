import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border z-50 backdrop-blur-xl"
    >
      <Slider
        value={[progress]}
        max={currentVideo.lengthSeconds}
        step={1}
        onValueChange={(value) => seek(value[0])}
        className="absolute -top-2 left-0 right-0"
      />

      <div className="flex items-center h-16 px-4 gap-4">
        <div className="relative h-10 aspect-video flex-shrink-0">
          <img
            src={extractThumbnailUrl(currentVideo.videoId)}
            alt={currentVideo.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate text-foreground">{currentVideo.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {currentVideo.author}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm hidden sm:inline text-muted-foreground">
            {formatDuration(progress)} / {formatDuration(currentVideo.lengthSeconds)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8"
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
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}