<template>
  <div class="rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-gray-100">
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="rounded-lg bg-green-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-600 active:bg-green-700 active:scale-[0.97]"
        @click="startScreenRecorder"
      >
        开始录屏
      </button>
      <button
        class="rounded-lg bg-red-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 active:bg-red-700 active:scale-[0.97]"
        @click="stopScreenRecorder"
      >
        结束录屏
      </button>
    </div>
    <div class="mt-4 flex flex-col md:flex-row items-center gap-4">
      <!-- 注意不需要镜像效果 -->
      <video ref="previewDomRef" class="w-full md:w-1/2 rounded-lg bg-black shadow-md"></video>
      <video ref="resultDomRef" class="w-full md:w-1/2 rounded-lg shadow-md" controls="true"></video>
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
