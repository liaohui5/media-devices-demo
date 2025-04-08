import { computed, onMounted, ref } from "vue";
import { AudioRecorder, createAudioRecorder } from "./AudioRecorder";
import { Camera, createCamera } from "./Camera";
import { CameraRecorder, createCameraRecorder, createScreenRecorder, ScreenRecorder } from "./VideoRecorder";

export type RecorderInst = Camera | CameraRecorder | ScreenRecorder | AudioRecorder;
export interface RecorderOptions {
  type: "audio" | "screen" | "camera" | "take-photo";
}

export const recorderFactoryMap = {
  audio: createAudioRecorder,
  screen: createScreenRecorder,
  camera: createCameraRecorder,
  "take-photo": createCamera,
};

// 注: 这个是内部使用的, 不需要暴露出去
function internalRecorderFactory(options: RecorderOptions) {
  const previewDomRef = ref<HTMLVideoElement>();
  const resultDomRef = ref();
  const resultBlob = ref<Blob | undefined>();
  const resultUrl = computed<string>(() => {
    if (resultBlob.value) {
      return URL.createObjectURL(resultBlob.value);
    }
    return "";
  });

  // onMounted: init recorderInst
  const factory = recorderFactoryMap[options.type];
  let recorderInst: RecorderInst | undefined;
  onMounted(() => {
    recorderInst = factory();
  });

  async function start() {
    await recorderInst!.start();

    // handle preview dom
    if (previewDomRef.value) {
      (recorderInst as ScreenRecorder).initVideoElement(previewDomRef.value);
    }
  }

  async function stop() {
    const blob = await recorderInst!.stop();
    resultBlob.value = blob;

    // handle result dome
    if (resultDomRef.value) {
      resultDomRef.value.src = resultUrl.value;
    }
  }

  return {
    start,
    stop,
    previewDomRef,
    resultDomRef,
    resultBlob,
    resultUrl,
    recorderInst,
  };
}

export const useAudioRecorder = () => internalRecorderFactory({ type: "audio" });
export const useScreenRecorder = () => internalRecorderFactory({ type: "screen" });
export const useCameraRecorder = () => internalRecorderFactory({ type: "camera" });
export const useCameraTakePhoto = () => internalRecorderFactory({ type: "take-photo" });
