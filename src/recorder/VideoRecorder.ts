import { BaseRecorder } from "./BaseRecorder";
import { MediaStreamRecorder } from "recordrtc";

export abstract class VideoRecorderAbstruct extends BaseRecorder {
  videoElement?: HTMLVideoElement;

  constructor() {
    super({
      type: "video",
      mimeType: "video/mp4",
      recorderType: MediaStreamRecorder,
    });
  }

  initVideoElement(videoEl: HTMLVideoElement) {
    if (!(videoEl instanceof HTMLVideoElement)) {
      throw new Error("[Camera]paramter must be instanceof HTMLVideoElement");
    }
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.style.objectFit = "cover";
    videoEl.onloadedmetadata = () => videoEl.play(); // autoplay
    videoEl.srcObject = this.stream!;
    this.videoElement = videoEl;
  }
}

export class CameraRecorder extends VideoRecorderAbstruct {
  async initStream() {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }
}

export class ScreenRecorder extends VideoRecorderAbstruct {
  async initStream() {
    return await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });
  }
}

export const createCameraRecorder = () => new CameraRecorder();
export const createScreenRecorder = () => new ScreenRecorder();
