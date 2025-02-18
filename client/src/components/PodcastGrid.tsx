import { PodcastCard } from "./PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePodcastData } from "@/hooks/usePodcastData";
import { useAudioStore } from "@/lib/store";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export function PodcastGrid() {
  const { data, isLoading } = usePodcastData();
  const { searchQuery, selectedCreator, setSearchQuery, setSelectedCreator } = useAudioStore();

  const filteredVideos = data?.videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCreator = !selectedCreator || video.author === selectedCreator;
    return matchesSearch && matchesCreator;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 animate-pulse">
          <Skeleton className="h-11 w-full sm:w-[300px]" />
          <Skeleton className="h-11 w-full sm:w-[200px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[1.8] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search podcasts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[300px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors h-11"
        />
        <Select
          value={selectedCreator || "all"}
          onValueChange={(value) => setSelectedCreator(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 transition-colors h-11">
            <SelectValue placeholder="All creators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All creators</SelectItem>
            {data?.creators.map(creator => (
              <SelectItem key={creator.name} value={creator.name}>
                {creator.name} ({creator.totalVideos})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {filteredVideos?.map((video) => (
          <motion.div key={video.videoId} variants={item}>
            <PodcastCard video={video} />
          </motion.div>
        ))}
        {filteredVideos?.length === 0 && (
          <motion.div 
            variants={item} 
            className="col-span-full text-center py-16"
          >
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-primary/10 max-w-md mx-auto">
              <p className="text-xl text-muted-foreground mb-2 font-medium">
                No podcasts found
              </p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}