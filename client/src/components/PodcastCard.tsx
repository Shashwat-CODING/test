import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatViewCount, extractThumbnailUrl } from "@/lib/utils";
import { useAudioStore } from "@/lib/store";
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
    <div className="w-full opacity-0 animate-fade-slide-up">
      <Card className="group relative overflow-hidden bg-black/20 backdrop-blur-sm border-primary/10 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 transition-all duration-700 ease-out">
        <CardContent className="p-0">
          <div 
            className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-t-xl"
            onClick={() => setCurrentVideo(video)}
          >
            <img 
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
            <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2.5 py-1 text-xs rounded-md backdrop-blur-sm font-medium">
              {formatDuration(video.lengthSeconds)}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary cursor-pointer transition-colors duration-500 ease-out"
                onClick={() => setCurrentVideo(video)}
              >
                {video.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 hover:bg-primary/10 transition-all duration-500 ease-out">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-lg bg-background/95">
                  <DropdownMenuItem onClick={() => addToQueue(video)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Queue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleLike(video.videoId)} className="gap-2">
                    <Heart className={`h-4 w-4 transition-colors duration-500 ease-out ${liked ? 'fill-primary text-primary' : ''}`} />
                    {liked ? 'Unlike' : 'Like'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground/80">
              <p className="line-clamp-1 flex-1 hover:text-primary transition-colors duration-500 ease-out cursor-pointer">{video.author}</p>
              <p className="text-xs font-medium">{formatViewCount(video.viewCount)} views</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}