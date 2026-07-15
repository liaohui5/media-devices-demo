<template>
  <div class="rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-gray-100">
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="rounded-lg bg-green-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-600 active:bg-green-700 active:scale-[0.97]"
        @click="handleStart"
      >
        开始录摄像头
      </button>
      <button
        class="rounded-lg bg-red-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 active:bg-red-700 active:scale-[0.97]"
        @click="handleStop"
      >
        结束录摄像头
      </button>
    </div>
    <div class="mt-4 flex flex-col md:flex-row items-center gap-4">
      <video ref="previewDomRef" class="w-full md:w-1/2 rounded-lg bg-black shadow-md"></video>
      <video ref="resultDomRef" class="w-full md:w-1/2 rounded-lg shadow-md" controls="true"></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCameraRecorder } from "./recorder";

const { start, stop, previewDomRef, resultDomRef, resultBlob } = useCameraRecorder();

async function handleStart() {
  await start();
}

async function handleStop() {
  await stop();
  console.log("resultBlob:", resultBlob);
}
</script>
