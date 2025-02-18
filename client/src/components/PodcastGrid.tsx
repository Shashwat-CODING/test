import { PodcastCard } from "./PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePodcastData } from "@/hooks/usePodcastData";
import { useAudioStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01,
      duration: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 3 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.1
    }
  }
};

export function PodcastGrid() {
  const { data, isLoading } = usePodcastData();
  const { searchQuery, selectedCreator } = useAudioStore();

  // Memoize filtering and sorting
  const filteredAndSortedVideos = data?.videos.filter(video => {
    if (!searchQuery && !selectedCreator) return true;
    const matchesSearch = !searchQuery || video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCreator = !selectedCreator || video.author === selectedCreator;
    return matchesSearch && matchesCreator;
  }).sort((a, b) => selectedCreator ? 
    b.published - a.published : 
    b.viewCount - a.viewCount
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-[1.6] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={selectedCreator || 'all'}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredAndSortedVideos?.map((video) => (
          <motion.div 
            key={video.videoId} 
            variants={item}
            layout={false}
            className="will-change-transform"
          >
            <PodcastCard video={video} />
          </motion.div>
        ))}
        {filteredAndSortedVideos?.length === 0 && (
          <motion.div 
            variants={item} 
            className="col-span-full text-center py-12 text-muted-foreground bg-black/20 backdrop-blur-sm rounded-xl border border-primary/10"
          >
            No podcasts found
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}