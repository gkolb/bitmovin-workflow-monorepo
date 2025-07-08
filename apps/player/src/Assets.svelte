<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">Assets</div> -->
<script lang="ts">
    type Asset = {
      name: string
      url: string
    }
  
    export let assets: Asset[] = [
      { name: "asset1.mpd", url: "url1" },
      { name: "asset2.mpd", url: "url2" },
      { name: "asset3.mpd", url: "url3" },
      { name: "asset4.mpd", url: "url4" },
    ]
  
  </script>

<div class="w-full min-w-[240px]">
  <div class="bg-card shadow-sm border rounded-xl">
    <!-- Header -->
    <div class=" rounded-t-xl flex font-semibold px-4 py-2 bg-muted">
        <div>Assets</div>
      </div>
    
      {#each assets as asset}
      <div class="border-t px-4 py-2">
        <div>{asset.name}</div>
      </div>
      {/each}
</div>
</div>


