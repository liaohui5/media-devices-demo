<template>
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="takePhoto">开始拍照</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopCamera">结束拍照</button>
    </div>

    <div class="flex">
      <!-- 注意镜像效果 scale-x-[-1] -->
      <video ref="previewDomRef" class="w-[480px] h-[640px] border scale-x-[-1]"></video>
      <img ref="resultDomRef" class="ml-4 object-cover border" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCameraTakePhoto } from "./recorder";

const { start, stop, previewDomRef, resultDomRef, resultBlob } = useCameraTakePhoto();

async function takePhoto() {
  await start();
}

async function stopCamera() {
  await stop();
  console.log("resultBlob:", resultBlob);
}
</script>
