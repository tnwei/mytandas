<script lang="ts">
  import { MapLibre, Marker, DefaultMarker, Popup } from 'svelte-maplibre';
  import type { Toilet } from '$lib/types';

  export let toilets: Toilet[];

  let map: maplibregl.Map;

  function handleMapLoad(event: CustomEvent<maplibregl.Map>) {
    map = event.detail;
    if (toilets.length > 0) {
      map.flyTo({
        center: [toilets[0].lon, toilets[0].lat],
        zoom: 13
      });
    }
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
</script>

<div class="w-full h-full relative">
  <MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    standardControls
    center={[0, 0]}
    zoom={2}
  >
    {#each toilets as toilet}
      <DefaultMarker lngLat={[toilet.lon, toilet.lat]}>
        <Popup>
          <strong>{toilet.name}</strong>
        </Popup>
      </DefaultMarker>
    {/each}
  </MapLibre>
</div>