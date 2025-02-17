import { PodcastCard } from "./PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePodcastData } from "@/hooks/usePodcastData";
import { useAudioStore } from "@/lib/store";

export function PodcastGrid() {
  const { data, isLoading } = usePodcastData();
  const { searchQuery, selectedCreator, setSearchQuery, setSelectedCreator } = useAudioStore();

  const filteredVideos = data?.videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCreator = !selectedCreator || video.author === selectedCreator;
    return matchesSearch && matchesCreator;
  }).sort((a, b) => {
    if (selectedCreator) {
      // Sort by published date (newest first) when viewing specific creator
      return b.published - a.published;
    }
    // Sort by views when viewing all creators
    return b.viewCount - a.viewCount;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-video" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
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
          className="sm:max-w-xs"
        />
        <Select
          value={selectedCreator || "all"}
          onValueChange={(value) => setSelectedCreator(value === "all" ? null : value)}
        >
          <SelectTrigger className="sm:max-w-xs">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVideos?.map((video) => (
          <PodcastCard key={video.videoId} video={video} />
        ))}
        {filteredVideos?.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No podcasts found
          </div>
        )}
      </div>
    </div>
  );
}