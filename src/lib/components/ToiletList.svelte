<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  import type { Toilet } from "$lib/types";

  export let toilets: Toilet[];
  export let selectedToilet: Toilet | null = null;

  const dispatch = createEventDispatcher();

  function handleToiletClick(toilet: Toilet) {
    dispatch('selectToilet', toilet);
  }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-md">
  <ul class="divide-y divide-gray-200">
    {#each toilets as toilet}
      <li 
        class="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        class:bg-blue-100={selectedToilet === toilet}
        on:click={() => handleToiletClick(toilet)}
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-indigo-600 truncate">
            {toilet.name}
          </p>
          <div class="ml-2 flex-shrink-0 flex">
            <p
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
            >
              Open
            </p>
          </div>
        </div>
        <div class="mt-2 sm:flex sm:justify-between">
          <div class="sm:flex">
            <p class="flex items-center text-sm text-gray-500">
              Lat: {toilet.lat.toFixed(4)}, Lon: {toilet.lon.toFixed(4)}
            </p>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>