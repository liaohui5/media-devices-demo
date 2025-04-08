<template>
  <!-- audio -->
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startAudioRecorder">开始录音</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopAudioRecorder">结束录音</button>
    </div>
    <div class="flex items-center">
      <div class="w-1/2">{{ audioMsg }}</div>
      <audio class="w-1/2" ref="audioRef" controls="true"></audio>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { createAudioRecorder, AudioRecorder } from "./recorder";

// 录麦克风
const audioRef = ref();
const audioMsg = ref("麦克风未启动");

let audioRecorder: AudioRecorder | null = null;
onMounted(() => {
  audioRecorder = createAudioRecorder();
});
async function startAudioRecorder() {
  await audioRecorder!.start();
  audioMsg.value = "请说话...";
}
async function stopAudioRecorder() {
  const blob = await audioRecorder!.stop();
  const url  = URL.createObjectURL(blob!);
  audioMsg.value = "录音已结束";
  audioRef.value.src = url;
  console.log("audio-result", { url, blob });
}
</script>
