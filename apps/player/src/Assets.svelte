<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">Assets</div> -->
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    S3Client,
    ListObjectsCommand,
    type _Object,
  } from '@aws-sdk/client-s3';
  import { loadPlayer } from './state.svelte.ts';
  const BUCKET_NAME = import.meta.env.VITE_AWS_OUTPUT_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION; // update as needed
  const SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY!;
  const ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
  const AWS_URL = import.meta.env.VITE_OUTPUT_BUCKET_URL;

  if (!BUCKET_NAME || !REGION || !SECRET_KEY || !ACCESS_KEY || !AWS_URL) {
    throw new Error('AWS credentials messed up');
  }

  let assets = $state([]);

  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  async function fetchS3Assets() {
    try {
      const command = new ListObjectsCommand({
        Bucket: BUCKET_NAME,
        Delimiter: '/',
      });
      const response = await client.send(command);
      let s3Assets: string[] = [];
      response.CommonPrefixes.forEach((item) => {
        s3Assets.push(item.Prefix + 'stream.mpd');
        s3Assets.push(item.Prefix + 'stream.m3u8');
      });
      console.log('newAssets: ', s3Assets);
      assets = [...s3Assets];
    } catch (err) {
      console.error('Error listing S3 objects:', err);
    }
  }

  onMount(() => {
    fetchS3Assets();
    const interval = setInterval(() => {
      fetchS3Assets();
    }, 10000);

    return () => clearInterval(interval);
  });
</script>

<div class="w-full min-w-[240px]">
  <div class="bg-card shadow-sm border rounded-xl">
    <div class=" rounded-t-xl flex font-semibold px-4 py-2 bg-muted">
      <div>Assets</div>
    </div>

    {#each assets as asset}
      <div class="border-t px-4 py-2">
        <button
          class="py-1 text-lg font-medium underline-offset-4 hover:underline md:text-base cursor-pointer"
          onclick={() => loadPlayer(AWS_URL + asset)}
        >
          {asset}
        </button>
      </div>
    {/each}
  </div>
</div>
