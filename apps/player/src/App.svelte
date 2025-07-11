<script lang="ts">
  import FileUpload from './FileUpload.svelte';
  import PendingTasks from './PendingTasks.svelte';
  import Player from './Player.svelte';
  import Assets from './Assets.svelte';

  const defaultUrl: string = import.meta.env.VITE_DEFAULT_DASH_URL;
</script>

<header class="border-b">
  <div class="p-4 flex items-center gap-2 justify-between">
    <div class="font-bold text-3xl">Bitmovin Workflow</div>
  </div>
</header>
<div class="container mx-auto p-15 px-4 space-y-8">
  <Player {defaultUrl} />
  <div class="flex flex-col lg:flex-row gap-4 m-10 lg:m-4">
    <FileUpload />
    <PendingTasks />
    <Assets />
  </div>
</div>

<style>
  @import './app.css';
</style>
