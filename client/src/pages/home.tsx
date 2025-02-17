import { PodcastGrid } from "@/components/PodcastGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background/80">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Featured Podcasts
        </h1>
        <PodcastGrid />
      </div>
    </div>
  );
}