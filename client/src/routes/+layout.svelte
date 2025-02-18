<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import { MiniPlayer } from '$lib/components/MiniPlayer.svelte';
  import { audioStore } from '$lib/stores/audioStore';

  onMount(() => {
    audioStore.initAudio();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-background to-primary/5">
  <slot />
  <MiniPlayer />
</div>