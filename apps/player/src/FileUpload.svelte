<!-- <div class="flex items-center justify-center w-full h-10 m-4 bg-gray-200 animate-pulse rounded-md">File Upload</div> -->

<script lang="ts">
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  let files = $state();

  $effect(() => {
    if (files) {
      // Note that `files` is of type `FileList`, not an Array:
      // https://developer.mozilla.org/en-US/docs/Web/API/FileList
      console.log(files);

      for (const file of files) {
        console.log(`${file.name}: ${file.size} bytes`);
      }
    }
  });

  async function uploadFiles() {
    if (!files) {
      console.error('files not defined');
      return;
    }

    // let fileName = ''
    let file;

    if (files && files.length > 0) {
      // fileName = `${files[0].name}`;
      file = files[0];
      console.log('file.name: ', file.name);
      console.log('file.type: ', file.type);
    } else {
      console.error('Unable to retrieve file name');
      return;
    }

    const { url, key } = await fetch(
      `http://localhost:3000/presign?filename=${encodeURIComponent(file.name)}`,
    ).then((res) => res.json());

    if (!url) {
      console.error('unable to retrieve presigned s3 url from server');
      return;
    }

    const formData = new FormData();

    for (const file of Array.from(files)) {
      formData.append('files', file);
    }

    try {
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type, // ensure correct metadata
        },
        body: file,
      });

      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status} ${resp.statusText}`);
      } else {
        console.log('File uploaded successfully');
      }
    } catch (err: any) {
      console.error(err);
      uploadError.set(err.message || 'Upload failed');
    } finally {
      uploading.set(false);
    }
  }
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
            <Input type="file" accept="video/mp4, video/quicktime" bind:files />
          </div>
        </div>
      </form>
    </Card.Content>
    <Card.Footer class="flex-col gap-2">
      <Button
        type="submit"
        onclick={uploadFiles}
        disabled={!files}
        class="w-full">Upload</Button
      >
    </Card.Footer>
  </Card.Root>
</div>
