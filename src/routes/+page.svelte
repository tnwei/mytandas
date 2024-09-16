<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import ToiletList from '$lib/components/ToiletList.svelte';
  import type { Toilet } from '$lib/types';

  let toilets: Toilet[] = [];
  let selectedToilet: Toilet | null = null;
  let map: maplibregl.Map | null = null;

  async function loadRestrooms(bbox?: number[]) {
    console.log("loadRestrooms() called");
    let url = '/backend/toilets';
    if (bbox) {
      console.log("with bbox", bbox);
      url += `?bbox=${bbox.join(',')}`;
    }
    console.log(url);
    const response = await fetch(url);
    toilets = await response.json();
    console.log("toilets populated by loadRestrooms()! length:", toilets.length);
  }


  function handleSelectToilet(event: CustomEvent<Toilet>) {
    selectedToilet = event.detail;
  }

  function handleMapLoad(event: CustomEvent<maplibregl.Map>) {
    map = event.detail;

    map.on('moveend', () => {
      if (map) {
        const bounds = map.getBounds();
        const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
        loadRestrooms(bbox);
      }
    });

    const bounds = map.getBounds();
    const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    loadRestrooms(bbox);
  }
</script>

<main class="container mx-auto flex flex-col h-screen">
  <h1 class="text-3xl font-bold mb-4">Public Toilets Near You</h1>
  <div class="flex-grow grid grid-cols-1 md:grid-cols-10 gap-4 py-4 h-[calc(100vh-4rem)]">
    
    <div class="h-full md:col-span-7">
      <Map {toilets} {selectedToilet} on:selectToilet={handleSelectToilet} on:mapLoad={handleMapLoad}/>
    </div>
    <div class="h-full md:col-span-3 overflow-y-auto px-4">
      <ToiletList {toilets} {selectedToilet} on:selectToilet={handleSelectToilet}/>
    </div>
    
  </div>
</main>