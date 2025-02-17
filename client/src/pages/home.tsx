import { PodcastGrid } from "@/components/PodcastGrid";
import { useAudioStore } from "@/lib/store";

export default function Home() {
  const { colors } = useAudioStore();

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: `${colors.background}cc`,
      color: colors.foreground
    }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Featured Podcasts
        </h1>
        <PodcastGrid />
      </div>
    </div>
  );
}