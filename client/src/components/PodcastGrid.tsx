import { PodcastCard } from "./PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePodcastData } from "@/hooks/usePodcastData";
import { useAudioStore } from "@/lib/store";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredAndSortedVideos?.map((video, index) => (
        <div 
          key={video.videoId}
          className="animate-slide-up"
          style={{
            animationDelay: `${index * 50}ms`,
            willChange: 'transform'
          }}
        >
          <PodcastCard video={video} />
        </div>
      ))}
      {filteredAndSortedVideos?.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground bg-black/20 backdrop-blur-sm rounded-xl border border-primary/10 animate-slide-up">
          No podcasts found
        </div>
      )}
    </div>
  );
}