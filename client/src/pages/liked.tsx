import { PodcastCard } from "@/components/PodcastCard";
import { useAudioStore } from "@/lib/store";
import { usePodcastData } from "@/hooks/usePodcastData";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function LikedPodcasts() {
  const { data } = usePodcastData();
  const { likedPodcasts } = useAudioStore();

  const likedPodcastsArray = data?.videos.filter(video => 
    likedPodcasts.has(video.videoId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center py-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary/50 bg-clip-text text-transparent">
            Liked Podcasts
          </h2>
          <Navbar />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {likedPodcastsArray?.map((video) => (
            <motion.div 
              key={video.videoId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PodcastCard video={video} />
            </motion.div>
          ))}
          {(!likedPodcastsArray || likedPodcastsArray.length === 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-primary/10">
                <p className="text-xl text-muted-foreground mb-2">
                  No liked podcasts yet
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Start exploring and like your favorite podcasts!
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}