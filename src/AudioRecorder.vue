<template>
  <!-- audio -->
  <div class="rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-gray-100">
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="rounded-lg bg-green-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-600 active:bg-green-700 active:scale-[0.97]"
        @click="startAudioRecorder"
      >
        开始录音
      </button>
      <button
        class="rounded-lg bg-red-500 px-4 md:px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-600 active:bg-red-700 active:scale-[0.97]"
        @click="stopAudioRecorder"
      >
        结束录音
      </button>
    </div>
    <div class="mt-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
      <div class="text-sm text-gray-600 shrink-0">{{ audioMsg }}</div>
      <audio class="w-full md:flex-1 rounded-lg" ref="resultDomRef" controls="true"></audio>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAudioRecorder } from "./recorder";

// 录麦克风
const audioMsg = ref("麦克风未启动");

const { start, stop, resultBlob, resultDomRef } = useAudioRecorder();

async function startAudioRecorder() {
  await start();
  audioMsg.value = "请说话...";
}

async function stopAudioRecorder() {
  await stop();
  audioMsg.value = "录音已结束, 请点击开始录音";
  console.log("resultBlob:", resultBlob);
}
</script>
