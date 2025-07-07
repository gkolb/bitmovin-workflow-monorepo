<script lang="ts">
  import Player from './Player.svelte';

  const source = {
    dash: import.meta.env.VITE_SOURCE_URL
  };
</script>

<Player {source} />
