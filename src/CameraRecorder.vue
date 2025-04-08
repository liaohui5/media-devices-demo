<template>
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="handleStart">开始录摄像头</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="handleStop">结束录摄像头</button>
    </div>
    <div class="flex items-center">
      <!-- 注意镜像效果 scale-x-[-1] -->
      <video ref="previewDomRef" class="w-1/2 bg-black scale-x-[-1]"></video>
      <video ref="resultDomRef" class="w-1/2 scale-x-[-1]" controls="true"></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCameraRecorder } from "./recorder";

// 录屏幕
const { start, stop, previewDomRef, resultDomRef, resultBlob } = useCameraRecorder();

async function handleStart() {
  await start();
}

async function handleStop() {
  await stop();
  console.log("resultBlob:", resultBlob);
}
</script>
