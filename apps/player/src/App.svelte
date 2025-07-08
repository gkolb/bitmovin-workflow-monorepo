<style>
  @import './app.css';
</style>

<script lang="ts">
  import FileUpload from './FileUpload.svelte';
  import PendingTasks from './PendingTasks.svelte';
  import Player from './Player.svelte';
  import Assets from './Assets.svelte';

  const source = {
    dash: import.meta.env.VITE_DASH_SOURCE_URL
  };
</script>

<div class="container mx-auto p-15 px-4 space-y-8">
  <Player {source} />
  <div class="flex gap-4">
    <FileUpload />
    <PendingTasks />
    <Assets />
  </div>
</div>
