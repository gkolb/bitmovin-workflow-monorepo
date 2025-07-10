<script lang="ts">
  import { onMount } from 'svelte';

  export let source: { dash?: string; hls?: string };

  onMount(async () => {
    const { Player } = await import('bitmovin-player');
    const { UIFactory } = await import('bitmovin-player-ui');
    await import('bitmovin-player-ui/dist/css/bitmovinplayer-ui.min.css');

    const container = document.getElementById('player-container');
    if (!container) return;

    const player = new Player(container, {
      key: import.meta.env.VITE_BITMOVIN_PLAYER_KEY,
      ui: true,
    });

    UIFactory.buildDefaultUI(player);

    player.load(source).then(
      () => console.info('Player loaded'),
      (e) => console.error('Player load error', e),
    );
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
