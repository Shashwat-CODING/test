import { PodcastCard } from "@/components/PodcastCard";
import { useAudioStore } from "@/lib/store";
import { usePodcastData } from "@/hooks/usePodcastData";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function LikedPodcasts() {
  const { data, isLoading } = usePodcastData();
  const { likedPodcasts } = useAudioStore();

  const likedPodcastsArray = data?.videos.filter(video => 
    likedPodcasts.has(video.videoId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Podcast Heaven
          </h1>
          <Navbar />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary/80">
            Your Liked Podcasts
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-pulse bg-card/30 backdrop-blur-sm rounded-xl p-8">
                <p className="text-muted-foreground">Loading your liked podcasts...</p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-xl text-muted-foreground mb-2">
                      No liked podcasts yet
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Start exploring and like your favorite podcasts to see them here!
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}