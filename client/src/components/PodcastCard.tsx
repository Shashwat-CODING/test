import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatViewCount, extractThumbnailUrl } from "@/lib/utils";
import { useAudioStore } from "@/lib/store";
import { motion } from "framer-motion";
import type { PodcastVideo } from "@/lib/store";

interface PodcastCardProps {
  video: PodcastVideo;
}

export function PodcastCard({ video }: PodcastCardProps) {
  const setCurrentVideo = useAudioStore(state => state.setCurrentVideo);
  const thumbnailUrl = extractThumbnailUrl(video.videoId);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full sm:w-[300px]"
    >
      <Card 
        className="overflow-hidden cursor-pointer group hover:bg-muted/50 bg-card/50 backdrop-blur-sm border-border h-full"
        onClick={() => setCurrentVideo(video)}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={thumbnailUrl}
              alt={video.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
              {formatDuration(video.lengthSeconds)}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {video.author}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatViewCount(video.viewCount)} views
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}