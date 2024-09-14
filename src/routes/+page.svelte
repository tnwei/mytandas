<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import ToiletList from '$lib/components/ToiletList.svelte';
  import type { Toilet } from '$lib/types';

  let toilets: Toilet[] = [];

  onMount(async () => {
    const response = await fetch('/backend/toilets');
    toilets = await response.json();
  });
</script>

<main class="flex flex-col h-screen">
  <h1 class="text-3xl font-bold mb-4">Public Toilets Near You</h1>
  <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
    {#if toilets.length > 0}
      <Map {toilets} />
      <ToiletList {toilets} />
    {:else}
      <p>Loading toilets data...</p>
    {/if}
  </div>
</main>