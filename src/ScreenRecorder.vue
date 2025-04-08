<template>
  <div class="pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="startScreenRecorder">开始录屏</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopScreenRecorder">结束录屏</button>
    </div>
    <div class="flex items-center">
      <!-- 注意镜像效果 scale-x-[-1] -->
      <video ref="screenPreviewRef" class="w-1/2 bg-black scale-x-[-1]"></video>
      <video ref="screeeResultRef" class="w-1/2" controls="true"></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { createScreenRecorder, ScreenRecorder } from "./recorder";

// 录屏幕
const screenPreviewRef = ref(); // 实时预览
const screeeResultRef = ref(); // 录制结果
let screenRecorder: null | ScreenRecorder = null;
onMounted(() => {
  screenRecorder = createScreenRecorder();
});

async function startScreenRecorder() {
  // 点击时再初始化(请求权限)
  await screenRecorder!.start();
  screenRecorder!.initVideoElement(screenPreviewRef.value);
}

async function stopScreenRecorder() {
  const blob = await screenRecorder!.stop();
  const url = URL.createObjectURL(blob!);
  screeeResultRef.value.src = url;
  console.log("stopScreenRecorder blob", blob);
}
</script>
