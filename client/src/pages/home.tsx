import { PodcastGrid } from "@/components/PodcastGrid";
import { Navbar } from "@/components/Navbar";
import { usePodcastData } from "@/hooks/usePodcastData";
import { PodcastCard } from "@/components/PodcastCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudioStore } from "@/lib/store";
import { Search } from "lucide-react";

export default function Home() {
  const { data } = usePodcastData();
  const { searchQuery, selectedCreator, setSearchQuery, setSelectedCreator } = useAudioStore();

  // Get the newest podcasts across all creators
  const newestPodcasts = data?.videos
    .sort((a, b) => b.published - a.published)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/95 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            Podcast Heaven
          </h1>
          <Navbar />
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search podcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-black/20 border-primary/10 hover:border-primary/20 focus:border-primary/30 backdrop-blur-sm placeholder:text-muted-foreground/50"
            />
          </div>
          <Select
            value={selectedCreator || "all"}
            onValueChange={(value) => setSelectedCreator(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-black/20 border-primary/10 hover:border-primary/20 focus:border-primary/30 backdrop-blur-sm">
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

        {/* Newest Section - Only show when no creator is selected */}
        {!selectedCreator && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-primary/80">
              Newest Episodes
            </h3>
            <ScrollArea className="w-full">
              <div className="flex space-x-6 pb-6">
                {newestPodcasts?.map((video) => (
                  <div key={video.videoId} className="w-[280px] lg:w-[320px] flex-shrink-0">
                    <PodcastCard video={video} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-primary/5" />
            </ScrollArea>
          </div>
        )}

        {/* Featured/Creator Section */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-6 text-primary/90 tracking-tight">
            {selectedCreator || "Featured"}
          </h3>
          <PodcastGrid />
        </div>
      </div>
    </div>
  );
}