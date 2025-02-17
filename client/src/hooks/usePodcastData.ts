import { useQuery } from '@tanstack/react-query';
import { PODCAST_CREATORS } from '@/lib/constants';
import { type PodcastVideo } from '@/lib/store';

interface RawVideo {
  videoId: string;
  title: string;
  description: string;
  filePath: string;
  published: number;
  publishedText: string;
  viewCount: number;
  lengthSeconds: number;
  liveNow: boolean;
}

interface CreatorData {
  totalVideos: number;
  videos: RawVideo[];
  creator: string;
}

export function usePodcastData() {
  return useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => {
      const responses = await Promise.all(
        Object.entries(PODCAST_CREATORS).map(async ([creator, url]) => {
          const response = await fetch(url);
          const data = await response.json();
          return {
            creator,
            ...data
          } as CreatorData;
        })
      );

      const allVideos = responses.flatMap(response => 
        response.videos.map(video => ({
          ...video,
          author: response.creator
        })) as PodcastVideo[]
      );

      return {
        videos: allVideos.sort((a, b) => b.viewCount - a.viewCount),
        creators: responses.map(r => ({
          name: r.creator,
          totalVideos: r.totalVideos
        }))
      };
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}