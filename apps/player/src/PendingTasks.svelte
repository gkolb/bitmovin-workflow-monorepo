<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">Pending Tasks</div> -->
<script lang="ts">
    import { onMount } from 'svelte';
    type Task = {
      id: string
      status: string,
      startedAt?: string
    }

    let tasks: Tasks = $state([]);
    async function listVodEncodings(apiKey) {
      const url = new URL('https://api.bitmovin.com/v1/encoding/encodings');
      url.searchParams.set('type', 'VOD'); // filter for VOD jobs

      const BITMOVIN_API_KEY = import.meta.env.VITE_BITMOVIN_API_KEY
      if (!BITMOVIN_API_KEY) {
        throw new Error('missing bitmovin api key')
      }
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Api-Key': BITMOVIN_API_KEY
        }
      });

      if (!res.ok) {
        throw new Error(`Bitmovin API error: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      // The encodings are in json.data.result.items
      let updatedTasks = []
      json.data.result.items.forEach(item => {
        updatedTasks.push({
          id: item.id,
          status: item.status,
          startedAt: item.startedAt
        })
      });
      console.log(updatedTasks)
      tasks = [...updatedTasks]
    }

    onMount(() => {
      listVodEncodings()
      const interval = setInterval(() => {
        listVodEncodings()
      }, 10000);

      return () => clearInterval(interval);
    });
  
    // export let tasks: Task[] = [
    //   { id: "enc-001", status: "queued", },
    //   { id: "enc-002", status: "processing" },
    //   { id: "enc-003", status: "completed" },
    //   { id: "enc-004", status: "failed" }
    // ]
  
    function getStatusColor(status: Task["status"]) {
      return {
        queued: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        FINISHED: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800"
      }[status]
    }

    function formatIso(isoString) {
      return new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(isoString));
}

console.log(formatIso("2025-07-09T15:32:52Z"));
  </script>
  
  <div class="bg-card shadow-sm rounded-xl w-full min-w-[240px] border">
      <div class="rounded-t-xl flex bg-muted font-semibold">
          <div class="w-1/2 px-4 py-2">ID</div>
          <div class="w-1/2 px-4 py-2">Status</div>
          <div class="w-1/2 px-4 py-2">Start Time</div>
      </div>
      <div>
        {#each tasks as task}
          <div class="flex w-full border-t">
            <div class="w-1/2 px-4 py-3">{task.id}</div>
            <div class="w-1/2 px-4 py-3">
              <span class={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            <div class="w-1/2 px-4 py-3">{formatIso(task.startedAt)}</div>
          </div>
        {/each}
    </div>
</div>

