<template>
  <div class="py-4">
    <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="takePhoto">开始拍照</button>
    <button class="px-4 py-2 mr-2 bg-blue-500 text-white" @click="stopCamera">结束拍照</button>
  </div>

  <div class="flex">
    <video ref="videoRef" class="w-[480px] h-[640px] border"></video>
    <img v-show="imageUrl" :src="imageUrl" class="ml-4 object-cover border">
  </div>
</template>

<script setup>
import { createCamera } from "./camera";
import { onMounted, ref } from "vue";

const videoRef = ref(null);
const imageUrl = ref(null);

let camera = null;
onMounted(async () => {
  camera = createCamera(videoRef.value);
  await camera.start();
});

async function takePhoto() {
  const {blob, url} = await camera.takePhoto();
  imageUrl.value = url;
  console.log("url:", url);
  console.log("file:", blob);
}

function stopCamera() {
  camera.stop();
}
</script>
