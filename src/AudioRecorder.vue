<template>
  <!-- audio -->
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startAudioRecorder">开始录音</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopAudioRecorder">结束录音</button>
    </div>
    <div class="flex items-center">
      <div class="w-1/2">{{ audioMsg }}</div>
      <audio class="w-1/2" ref="resultDomRef" controls="true"></audio>
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
