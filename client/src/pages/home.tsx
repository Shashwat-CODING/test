import { PodcastGrid } from "@/components/PodcastGrid";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 sm:px-4 lg:px-2">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center py-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary/50 bg-clip-text text-transparent">
            Featured
          </h2>
          <Navbar />
        </motion.div>
        <PodcastGrid />
      </div>
    </div>
  );
}