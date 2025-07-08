<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">Pending Tasks</div> -->
<script lang="ts">
    type Task = {
      id: string
      status: "queued" | "processing" | "completed" | "failed"
    }
  
    export let tasks: Task[] = [
      { id: "enc-001", status: "queued" },
      { id: "enc-002", status: "processing" },
      { id: "enc-003", status: "completed" },
      { id: "enc-004", status: "failed" }
    ]
  
    function getStatusColor(status: Task["status"]) {
      return {
        queued: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800"
      }[status]
    }
  </script>
  
  <div class="flex items-center justify-center w-full rounded-xl border border-border">
    <table class="w-full text-sm text-left">
      <thead class="bg-muted text-muted-foreground">
        <tr>
          <th class="px-4 py-3 font-medium">ID</th>
          <th class="px-4 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each tasks as task}
          <tr class="w-full border-t">
            <td class="px-4 py-3">{task.id}</td>
            <td class="px-4 py-3">
              <span class={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  

