<!-- <script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  count is {count}
</button> -->
<script lang="ts">
  import Player from './Player.svelte';

  const source = {
    dash: 'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
  };
</script>

<Player {source} />
