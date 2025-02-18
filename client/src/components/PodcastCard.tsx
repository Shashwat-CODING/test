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
import { Plus, MoreVertical, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PodcastVideo } from "@/lib/store";

interface PodcastCardProps {
  video: PodcastVideo;
}

export function PodcastCard({ video }: PodcastCardProps) {
  const { setCurrentVideo, addToQueue, toggleLike, isLiked } = useAudioStore();
  const thumbnailUrl = extractThumbnailUrl(video.videoId);
  const liked = isLiked(video.videoId);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-sm border-primary/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardContent className="p-0">
          <div 
            className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-t-xl"
            onClick={() => setCurrentVideo(video)}
          >
            <img 
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded-md backdrop-blur-sm">
              {formatDuration(video.lengthSeconds)}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary cursor-pointer transition-colors duration-200"
                onClick={() => setCurrentVideo(video)}
              >
                {video.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 hover:bg-primary/10">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-lg">
                  <DropdownMenuItem onClick={() => addToQueue(video)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Queue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleLike(video.videoId)} className="gap-2">
                    <Heart className={`h-4 w-4 ${liked ? 'fill-primary' : ''}`} />
                    {liked ? 'Unlike' : 'Like'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground/80">
              <p className="line-clamp-1 flex-1 hover:text-primary transition-colors duration-200">{video.author}</p>
              <p className="text-xs">{formatViewCount(video.viewCount)} views</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}