<template>
  <div class="pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startScreenRecorder">开始录屏</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopScreenRecorder">结束录屏</button>
    </div>
    <div class="flex items-center">
      <!-- 注意不需要镜像效果 -->
      <video ref="previewDomRef" class="w-1/2 bg-black"></video>
      <video ref="resultDomRef" class="w-1/2" controls="true"></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useScreenRecorder } from "./recorder";

const { start, stop, resultBlob, previewDomRef, resultDomRef } = useScreenRecorder();

// 录屏幕
async function startScreenRecorder() {
  await start();
}

async function stopScreenRecorder() {
  await stop();
  console.log("resultBlob:", resultBlob);
}
</script>
