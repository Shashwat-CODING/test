import { useEffect, useState } from "react";
import { useAudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDuration, extractThumbnailUrl } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward,
  Minimize2, X, Timer,
  Heart, FastForward, List
} from "lucide-react";

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60, 90];

export function AudioPlayer() {
  const {
    currentVideo,
    queue,
    isPlaying,
    progress,
    playbackSpeed,
    sleepTimerEndTime,
    setIsPlaying,
    setMinimized,
    setPlaybackSpeed,
    setSleepTimer,
    removeFromQueue,
    playNext,
    toggleLike,
    isLiked
  } = useAudioStore();

  const { seek, skip } = useAudioPlayer();
  const thumbnailUrl = currentVideo ? extractThumbnailUrl(currentVideo.videoId) : '';
  const [showQueue, setShowQueue] = useState(false);
  const liked = currentVideo ? isLiked(currentVideo.videoId) : false;

  if (!currentVideo) return null;

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const remainingTime = sleepTimerEndTime
    ? Math.max(0, Math.ceil((sleepTimerEndTime - Date.now()) / (60 * 1000)))
    : null;

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => currentVideo && toggleLike(currentVideo.videoId)}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-primary text-primary' : ''}`} />
          </Button>
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
          <div className="flex items-center gap-6">
            {/* Playback Speed Control */}
            <Select
              value={playbackSpeed.toString()}
              onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
            >
              <SelectTrigger className="w-[100px]">
                <FastForward className="h-4 w-4 mr-2" />
                <SelectValue>{playbackSpeed}x</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PLAYBACK_SPEEDS.map((speed) => (
                  <SelectItem key={speed} value={speed.toString()}>
                    {speed}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sleep Timer */}
            <Select
              value={remainingTime?.toString() ?? "off"}
              onValueChange={(value) => setSleepTimer(value === "off" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <Timer className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sleep Timer">
                  {remainingTime ? `${remainingTime}m left` : "Timer"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                {SLEEP_TIMER_OPTIONS.map((minutes) => (
                  <SelectItem key={minutes} value={minutes.toString()}>
                    {minutes} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Queue Button */}
            <Sheet open={showQueue} onOpenChange={setShowQueue}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <List className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Queue</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {queue.map((video, index) => (
                    <div key={video.videoId} className="flex items-center gap-4">
                      <img
                        src={extractThumbnailUrl(video.videoId)}
                        alt={video.title}
                        className="w-16 aspect-video object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{video.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {video.author}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromQueue(video.videoId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      Queue is empty
                    </p>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10"
              onClick={() => currentVideo && toggleLike(currentVideo.videoId)}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-primary text-primary' : ''}`} />
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

            {/* Mobile Controls */}
            <div className="md:hidden flex justify-center gap-4">
              <Select
                value={playbackSpeed.toString()}
                onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
              >
                <SelectTrigger className="w-[80px]">
                  <FastForward className="h-4 w-4 mr-2" />
                  <SelectValue>{playbackSpeed}x</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <SelectItem key={speed} value={speed.toString()}>
                      {speed}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={remainingTime?.toString() ?? "off"}
                onValueChange={(value) => setSleepTimer(value === "off" ? null : parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <Timer className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Timer">
                    {remainingTime ? `${remainingTime}m` : "Timer"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  {SLEEP_TIMER_OPTIONS.map((minutes) => (
                    <SelectItem key={minutes} value={minutes.toString()}>
                      {minutes}m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet open={showQueue} onOpenChange={setShowQueue}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <List className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Queue</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {queue.map((video, index) => (
                      <div key={video.videoId} className="flex items-center gap-4">
                        <img
                          src={extractThumbnailUrl(video.videoId)}
                          alt={video.title}
                          className="w-16 aspect-video object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{video.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {video.author}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromQueue(video.videoId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {queue.length === 0 && (
                      <p className="text-center text-muted-foreground">
                        Queue is empty
                      </p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
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