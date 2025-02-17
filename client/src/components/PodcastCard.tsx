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
  const colors = useAudioStore(state => state.colors);
  const thumbnailUrl = extractThumbnailUrl(video.videoId);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer group backdrop-blur-sm" 
        onClick={() => setCurrentVideo(video)}
        style={{ 
          backgroundColor: `${colors.background}99`,
          borderColor: colors.accent
        }}
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
          <div className="p-4">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
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