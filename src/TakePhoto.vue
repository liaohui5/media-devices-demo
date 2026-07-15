<template>
  <div class="rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-gray-100">
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="rounded-lg bg-green-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-600 active:bg-green-700 active:scale-[0.97]"
        @click="takePhoto"
      >
        开始拍照
      </button>
      <button
        class="rounded-lg bg-red-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 active:bg-red-700 active:scale-[0.97]"
        @click="stopCamera"
      >
        结束拍照
      </button>
    </div>

    <div class="mt-4 flex flex-col md:flex-row gap-4">
      <!-- 注意镜像效果 scale-x-[-1] -->
      <video
        ref="previewDomRef"
        class="w-full md:w-[480px] aspect-[3/4] md:h-[640px] rounded-lg border border-gray-200 bg-black shadow-md scale-x-[-1]"
      ></video>
      <img
        ref="resultDomRef"
        class="w-full md:flex-1 aspect-[3/4] md:aspect-auto rounded-lg border border-gray-200 bg-gray-100 object-cover shadow-md scale-x-[-1]"
      />
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
