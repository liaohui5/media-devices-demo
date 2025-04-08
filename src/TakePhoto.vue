<template>
  <div class="border-b pb-10">
    <div class="py-4">
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="takePhoto">开始拍照</button>
      <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopCamera">结束拍照</button>
    </div>

    <div class="flex">
      <!-- 注意镜像效果 scale-x-[-1] -->
      <video ref="videoRef" class="w-[480px] h-[640px] border scale-x-[-1]"></video>
      <img v-show="imageUrl" :src="imageUrl" class="ml-4 object-cover border" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Camera, createCamera } from "./recorder";

const videoRef = ref();
const imageUrl = ref("");

let camera: null | Camera = null;
onMounted(() => {
  camera = createCamera();
});

async function takePhoto() {
  camera!.start();
  camera!.initVideoElement(videoRef.value);
}

async function stopCamera() {
  const blob = await camera!.stop();
  const url = URL.createObjectURL(blob!);
  imageUrl.value = url;
}
</script>
