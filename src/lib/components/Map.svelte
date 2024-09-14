<script lang="ts">
  import { MapLibre, Marker, Popup, MapEvents } from 'svelte-maplibre';
  import type { Toilet } from '$lib/types';
  import { createEventDispatcher, onMount } from 'svelte';


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
          <div class="pin"></div>
          <div class="pulse"></div>
        </div>
      </Marker>
    {/each}
  </MapLibre>
</div>

<style>
.pin {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    background: #00cae9;
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
  }
  .pin:after {
    content: "";
    width: 14px;
    height: 14px;
    margin: 8px 0 0 8px;
    background: #e6e6e6;
    position: absolute;
    border-radius: 50%;
  }
  .selected .pin {
    background: #4CAF50;
  }
  .pulse {
    background: rgba(0, 202, 233, 0.2);
    border-radius: 50%;
    height: 14px;
    width: 14px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: 11px 0px 0px -12px;
    transform: rotateX(55deg);
    z-index: -2;
  }
  .selected .pulse {
    background: rgba(76, 175, 80, 0.2);
  }
  .pulse:after {
    content: "";
    border-radius: 50%;
    height: 40px;
    width: 40px;
    position: absolute;
    margin: -13px 0 0 -13px;
    animation: pulsate 1s ease-out;
    animation-iteration-count: infinite;
    opacity: 0;
    box-shadow: 0 0 1px 2px #00cae9;
    animation-delay: 1.1s;
  }
  .selected .pulse:after {
    box-shadow: 0 0 1px 2px #4CAF50;
  }
  @keyframes pulsate {
    0% {
      transform: scale(0.1, 0.1);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1.2, 1.2);
      opacity: 0;
    }
  }
</style>