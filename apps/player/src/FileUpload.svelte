<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">File Upload</div> -->

<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="w-full min-w-[240px]">
    <Card.Root>
        <Card.Header>
            <Card.Title>File Upload (.mp4)</Card.Title>
        </Card.Header>
        <Card.Content>
            <form>
            <div class="flex flex-col gap-6">
            <div class="grid gap-2">
            <Input type="file" />
            </div>
            </div>
            </form>
        </Card.Content>
        <Card.Footer class="flex-col gap-2">
            <Button type="submit" class="w-full">Upload</Button>
        </Card.Footer>
    </Card.Root>
</div>


