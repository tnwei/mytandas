<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import ToiletList from '$lib/components/ToiletList.svelte';
  import type { Toilet } from '$lib/types';

  let toilets: Toilet[] = [];
  let selectedToilet: Toilet | null = null;

  onMount(async () => {
    // const response = await fetch('/backend/toilets');
    const response = await fetch('toilets-excerpt.json');
    toilets = await response.json();
    console.log(toilets);
  });

  function handleSelectToilet(event: CustomEvent<Toilet>) {
    selectedToilet = event.detail;
  }
</script>

<main class="container mx-auto flex flex-col h-screen">
  <h1 class="text-3xl font-bold mb-4">Public Toilets Near You</h1>
  <div class="flex-grow grid grid-cols-1 md:grid-cols-10 gap-4 py-4">
    {#if toilets.length > 0}
    <div class="h-full md:col-span-7">
      <Map {toilets} {selectedToilet} on:selectToilet={handleSelectToilet}/>
    </div>
    <div class="h-full md:col-span-3 overflow-auto px-4">
      <ToiletList {toilets} {selectedToilet} on:selectToilet={handleSelectToilet}/>
    </div>
    {:else}
      <p>Loading toilets data...</p>
    {/if}
  </div>
</main>