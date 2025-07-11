<script lang="ts">
  import { onMount } from 'svelte';
  import { state, loadPlayer } from './state.svelte.ts';

  let props = $props();

  onMount(async () => {
    const { Player } = await import('bitmovin-player');
    const { UIFactory } = await import('bitmovin-player-ui');
    await import('bitmovin-player-ui/dist/css/bitmovinplayer-ui.min.css');

    const container = document.getElementById('player-container');
    if (!container) return;

    state.player = new Player(container, {
      key: import.meta.env.VITE_BITMOVIN_PLAYER_KEY,
      ui: true,
    });

    UIFactory.buildDefaultUI(state.player);

    loadPlayer(props.defaultUrl);
  });
</script>

<div class="flex items-center justify-center">
  <div class="w-full p-4 lg:px-50">
    <div
      id="player-container"
      style="width:100%;height:100%;border-radius:8px"
    ></div>
  </div>
</div>
