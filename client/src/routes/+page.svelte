<script lang="ts">
  import { Navbar } from '$lib/components/Navbar.svelte';
  import { PodcastGrid } from '$lib/components/PodcastGrid.svelte';
  import { Search } from 'lucide-svelte';
  import { audioStore } from '$lib/stores/audioStore';

  let searchQuery = '';
  let selectedCreator = null;

  $: filteredPodcasts = $audioStore.podcasts?.filter(podcast => {
    if (!searchQuery && !selectedCreator) return true;
    const matchesSearch = !searchQuery || 
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCreator = !selectedCreator || podcast.author === selectedCreator;
    return matchesSearch && matchesCreator;
  });

  $: creators = $audioStore.podcasts?.reduce((acc, podcast) => {
    if (!acc.find(c => c.name === podcast.author)) {
      acc.push({
        name: podcast.author,
        totalVideos: $audioStore.podcasts.filter(p => p.author === podcast.author).length
      });
    }
    return acc;
  }, []) ?? [];
</script>

<div class="container mx-auto px-4">
  <div class="flex justify-between items-center py-8">
    <h1 class="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
      Podcast Heaven
    </h1>
    <Navbar />
  </div>

  <!-- Search and Filter Section -->
  <div class="flex flex-col sm:flex-row gap-4 mb-8">
    <div class="relative w-full sm:w-[300px]">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
      <input
        type="text"
        placeholder="Search podcasts..."
        bind:value={searchQuery}
        class="w-full pl-10 bg-black/20 border-primary/10 hover:border-primary/20 focus:border-primary/30 backdrop-blur-sm placeholder:text-muted-foreground/50 rounded-md px-3 py-2"
      />
    </div>
    <select
      bind:value={selectedCreator}
      class="w-full sm:w-[200px] bg-black/20 border-primary/10 hover:border-primary/20 focus:border-primary/30 backdrop-blur-sm rounded-md px-3 py-2"
    >
      <option value={null}>All creators</option>
      {#each creators as creator}
        <option value={creator.name}>
          {creator.name} ({creator.totalVideos})
        </option>
      {/each}
    </select>
  </div>

  <!-- Featured Section -->
  <div class="mb-8">
    <h3 class="text-2xl font-bold mb-6 text-primary/80 tracking-tight">
      {selectedCreator || "Featured"}
    </h3>
    <PodcastGrid {filteredPodcasts} />
  </div>
</div>
