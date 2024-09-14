<script lang="ts">
  import { MapLibre, Marker, Popup, MapEvents } from 'svelte-maplibre';
  import type { Toilet } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  export let toilets: Toilet[];
  export let selectedToilet: Toilet | null = null;


  let map: maplibregl.Map | null = null;
  const dispatch = createEventDispatcher();

  // Teardown function apparently
  onMount(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  });

  function showLocation(e: CustomEvent<MapMouseEvent>) {
    console.log(e.detail.lngLat);
  }

  function handleMapLoad(event: CustomEvent<maplibregl.Map>) {
    map = event.detail;
    // if (toilets.length > 0) {
    //   map.flyTo({
    //     center: [toilets[0].lon, toilets[0].lat],
    //     zoom: 13
    //   });
    // }
  }

  function findNearestToilet(userLat: number, userLon: number): Toilet {
    let nearest = toilets[0];
    let shortestDistance = Infinity;

    toilets.forEach(toilet => {
      const distance = calculateDistance(userLat, userLon, toilet.lat, toilet.lon);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearest = toilet;
      }
    });

    return nearest;
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function handleMarkerClick(toilet: Toilet) {
    if (map) {
      map.flyTo({
        center: [toilet.lon, toilet.lat],
        zoom: 14,
        speed: 1.5
      });
    }
    dispatch('selectToilet', toilet);
  }

  $: if (selectedToilet && map) {
    map.flyTo({
      center: [selectedToilet.lon, selectedToilet.lat],
      zoom: 14,
      speed: 1.5
    });
  }
</script>

<!-- center={[101.69446708913938, 3.159171252389754]} -->

<div class="w-full h-full relative">
  <MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    standardControls
    center={[-73.98, 40.75]}
    zoom={10}
    on:load={handleMapLoad}
  >
  <MapEvents on:click={showLocation}/>
    {#each toilets as toilet}
      <Marker lngLat={[toilet.lon, toilet.lat]} on:click={() => handleMarkerClick(toilet)}>
        <div class="cursor-pointer text-2xl" class:selected={selectedToilet === toilet}>
          🚽
        </div>
        <Popup>
          <strong>{toilet.name}</strong>
        </Popup>
      </Marker>
    {/each}
  </MapLibre>
</div>

<style>
    .selected {
    color: #4CAF50;
    font-size: 32px;
  }
</style>