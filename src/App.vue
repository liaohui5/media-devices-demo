<template>
  <div class="container mx-auto overflow-x-auto">
    <div class="py-10">
      <h2 class="text-center text-lg">使用 navigator.mediaDevices WebAPI 录麦克风/录摄像头/录屏</h2>
      <p class="text-sm text-center">
        也可以用于测试电脑麦克风/摄像头硬件是否正常,有的时候可能会有电流麦,摄像头模糊等问题
      </p>
    </div>

    <!-- mircophone -->
    <AudioRecorder />

    <!-- take-phoeo -->
    <TakePhoto />

    <!-- camera -->
    <CameraRecorder />

    <!-- screen -->
    <ScreenRecorder />
  </div>
</template>

<script setup>
import TakePhoto from "./TakePhoto.vue";
import AudioRecorder from "./AudioRecorder.vue";
import CameraRecorder from "./CameraRecorder.vue";
import ScreenRecorder from "./ScreenRecorder.vue";
</script>
