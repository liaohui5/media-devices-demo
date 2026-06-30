<template>
  <div class="container mx-auto max-w-5xl px-4 pb-12">
    <div class="py-12 text-center">
      <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
        使用 navigator.mediaDevices WebAPI 录麦克风/录摄像头/录屏
      </h1>
      <p class="mt-2 text-sm text-gray-500">
        也可以用于测试电脑麦克风/摄像头硬件是否正常,有的时候可能会有电流麦,摄像头模糊等问题
      </p>
    </div>

    <div class="space-y-6">
      <!-- mircophone -->
      <AudioRecorder />

      <!-- take-phoeo -->
      <TakePhoto />

      <!-- camera -->
      <CameraRecorder />

      <!-- screen -->
      <ScreenRecorder />
    </div>
  </div>
</template>

<script setup lang="ts">
import TakePhoto from "./TakePhoto.vue";
import AudioRecorder from "./AudioRecorder.vue";
import CameraRecorder from "./CameraRecorder.vue";
import ScreenRecorder from "./ScreenRecorder.vue";
</script>
