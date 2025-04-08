<template>
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startCameraRecorder">开始录摄像头</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopCameraRecorder">结束录摄像头</button>
    </div>
    <div class="flex items-center">
      <video ref="cameraPreviewRef" class="w-1/2 bg-black"></video>
      <video ref="cameraResultRef" class="w-1/2" controls="true"></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { createCameraRecorder, CameraRecorder } from "./recorder";

// 录屏幕
const cameraPreviewRef = ref(); // 实时预览
const cameraResultRef = ref(); // 录制结果
let screenRecorder: null | CameraRecorder = null;
onMounted(() => {
  screenRecorder = createCameraRecorder();
});

async function startCameraRecorder() {
  // 点击时再初始化(请求权限)
  await screenRecorder!.start();
  screenRecorder!.initVideoElement(cameraPreviewRef.value);
}

async function stopCameraRecorder() {
  const blob = await screenRecorder!.stop();
  const url  = URL.createObjectURL(blob!);
  cameraResultRef.value.src = url;
  console.log("stopScreenRecorder blob", blob);
}
</script>
