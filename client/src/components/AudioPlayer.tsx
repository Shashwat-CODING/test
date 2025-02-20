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
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/10 backdrop-blur-2xl will-change-transform" style={{ 
      animationDuration: '200ms',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px'
    }}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMinimized(true)}
          className="hover:bg-white/10 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => currentVideo && toggleLike(currentVideo.videoId)}
          className="hover:bg-white/10 transition-colors duration-200"
        >
          <Heart className={`h-5 w-5 transition-colors duration-200 ${liked ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center px-8 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMinimized(true)}
          className="hover:bg-white/10 transition-colors"
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-6">
          {/* Playback Speed Control */}
          <Select
            value={playbackSpeed.toString()}
            onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
          >
            <SelectTrigger className="w-[100px] bg-black/20 border-primary/10 hover:border-primary/20">
              <FastForward className="h-4 w-4 mr-2" />
              <SelectValue>{playbackSpeed}x</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-lg">
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
            <SelectTrigger className="w-[120px] bg-black/20 border-primary/10 hover:border-primary/20">
              <Timer className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sleep Timer">
                {remainingTime ? `${remainingTime}m left` : "Timer"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-lg">
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
              <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors">
                <List className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background/95 backdrop-blur-xl border-primary/10">
              <SheetHeader>
                <SheetTitle>Queue</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {queue.map((video) => (
                  <div key={video.videoId} className="flex items-center gap-4 animate-fade-in">
                    <img
                      src={extractThumbnailUrl(video.videoId)}
                      alt={video.title}
                      className="w-16 aspect-video object-cover rounded-lg"
                      loading="lazy"
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
                      className="hover:bg-white/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {queue.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <List className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    Queue is empty
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10 transition-colors"
            onClick={() => currentVideo && toggleLike(currentVideo.videoId)}
          >
            <Heart className={`h-6 w-6 transition-colors duration-200 ${liked ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 p-4 md:p-8 overflow-y-auto">
        {/* Thumbnail Section */}
        <div className="w-full md:w-2/5 max-w-lg flex items-center justify-center">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group animate-zoom-in" style={{ 
            animationDuration: '250ms',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}>
            <img
              src={thumbnailUrl}
              alt={currentVideo.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              style={{ transform: 'translateZ(0)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
          </div>
        </div>

        {/* Controls Section */}
        <div className="w-full md:w-2/5 max-w-lg flex flex-col justify-center gap-8 animate-slide-up" style={{ 
          animationDuration: '200ms',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}>
          {/* Title and Author */}
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent line-clamp-2">
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
              <SelectTrigger className="w-[80px] bg-black/20 border-primary/10 hover:border-primary/20">
                <FastForward className="h-4 w-4 mr-2" />
                <SelectValue>{playbackSpeed}x</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-lg">
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
              <SelectTrigger className="w-[100px] bg-black/20 border-primary/10 hover:border-primary/20">
                <Timer className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Timer">
                  {remainingTime ? `${remainingTime}m` : "Timer"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-lg">
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
                <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-background/95 backdrop-blur-xl border-primary/10">
                <SheetHeader>
                  <SheetTitle>Queue</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {queue.map((video) => (
                    <div key={video.videoId} className="flex items-center gap-4 animate-fade-in">
                      <img
                        src={extractThumbnailUrl(video.videoId)}
                        alt={video.title}
                        className="w-16 aspect-video object-cover rounded-lg"
                        loading="lazy"
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
                        className="hover:bg-white/10 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <List className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      Queue is empty
                    </div>
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

              <div className="flex justify-between text-sm md:text-base text-muted-foreground/70 px-1 font-medium">
                <span>{formatDuration(progress)}</span>
                <span>{formatDuration(currentVideo.lengthSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-15)}
                className="h-14 w-14 md:h-16 md:w-16 hover:bg-white/10 transition-colors"
              >
                <SkipBack className="h-7 w-7 md:h-8 md:w-8" />
              </Button>

              <Button
                variant="default"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all duration-200"
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
                className="h-14 w-14 md:h-16 md:w-16 hover:bg-white/10 transition-colors"
              >
                <SkipForward className="h-7 w-7 md:h-8 md:w-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}