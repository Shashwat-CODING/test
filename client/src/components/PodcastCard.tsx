import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatViewCount, extractThumbnailUrl } from "@/lib/utils";
import { useAudioStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Plus, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PodcastVideo } from "@/lib/store";

interface PodcastCardProps {
  video: PodcastVideo;
}

export function PodcastCard({ video }: PodcastCardProps) {
  const { setCurrentVideo, addToQueue } = useAudioStore();
  const thumbnailUrl = extractThumbnailUrl(video.videoId);

  const handleShare = () => {
    navigator.share?.({
      title: video.title,
      text: `Check out this podcast: ${video.title} by ${video.author}`,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full sm:w-[280px] md:w-[300px]"
    >
      <Card 
        className="overflow-hidden group hover:bg-muted/50 bg-card/50 backdrop-blur-sm border-border h-[320px] relative"
      >
        <CardContent className="p-0 flex flex-col h-full">
          <div 
            className="relative w-full h-[168px] cursor-pointer"
            onClick={() => setCurrentVideo(video)}
          >
            <img 
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
              {formatDuration(video.lengthSeconds)}
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div 
              className="cursor-pointer"
              onClick={() => setCurrentVideo(video)}
            >
              <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {video.author}
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                {formatViewCount(video.viewCount)} views
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentVideo(video)}>
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addToQueue(video)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Queue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}