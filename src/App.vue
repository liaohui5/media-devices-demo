<template>
  <div class="container mx-auto overflow-x-auto">
    <div class="py-10">
      <h2 class="text-center text-lg">使用 navigator.mediaDevices WebAPI 录麦克风/录摄像头/录屏</h2>
      <p class="text-sm text-center">也可以用于测试电脑麦克风/摄像头硬件是否正常,有的时候可能会有电流麦,摄像头模糊等问题</p>
    </div>

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

    <!-- take-phoeo -->
    <div class="border-b pb-10">
      <TakePhoto />
    </div>

    <!-- camera -->
    <div class="border-b pb-10">
      <div class="py-4">
        <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startCameraRecorder">开始录摄像头</button>
        <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopCameraRecorder">结束录摄像头</button>
      </div>
      <div class="flex items-center">
        <video ref="cameraRef" class="w-1/2"></video>
        <video ref="cameraVideoRef" class="w-1/2" controls="true"></video>
      </div>
    </div>

    <!-- screen -->
    <div class="pb-10">
      <div class="py-4">
        <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startScreenRecorder">开始录屏</button>
        <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopScreenRecorder">结束录屏</button>
      </div>
      <div class="flex items-center">
        <video ref="screenRef" class="w-1/2"></video>
        <video ref="screenVideoRef" class="w-1/2" controls="true"></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import TakePhoto from "./take-phoeo.vue";
import { onMounted, ref } from "vue";
import { createAudioRecorder, createCameraRecorder, createScreenRecorder } from "./recorder.js";

// 录麦克风
const audioRef = ref(null);
const audioMsg = ref("麦克风未启动");

let audioRecorder = null;
onMounted(async () => {
  audioRecorder = createAudioRecorder();
  await audioRecorder.init();
});
async function startAudioRecorder() {
  await audioRecorder.start();
  audioMsg.value = "请说话...";
}
async function stopAudioRecorder() {
  const { url, blob } = await audioRecorder.stop();
  audioMsg.value = "录音已结束";
  audioRef.value.src = url;
  console.log("audio-result", { url, blob });
}

// 录摄像头
const cameraRef = ref(null);
const cameraVideoRef = ref(null);
let cameraRecorder = null;
onMounted(async () => {
  // 直接初始化
  cameraRecorder = createCameraRecorder();
  await cameraRecorder.init(cameraRef.value);
});

async function startCameraRecorder() {
  await cameraRecorder.start();
}
async function stopCameraRecorder() {
  const { url, blob } = await cameraRecorder.stop();
  cameraVideoRef.value.src = url;
  console.log("stopCameraRecorder blob", blob);
}

// 录屏幕
const screenRef = ref(null);
const screenVideoRef = ref(null);
let screenRecorder = null;
onMounted(() => {
  screenRecorder = createScreenRecorder();
});

async function startScreenRecorder() {
  // 点击时再初始化
  await screenRecorder.init(screenRef.value);
  await screenRecorder.start();
}

async function stopScreenRecorder() {
  const { url, blob } = await screenRecorder.stop();
  screenVideoRef.value.src = url;
  console.log("stopScreenRecorder blob", blob);
}
</script>
