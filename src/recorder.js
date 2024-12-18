import { RecordRTCPromisesHandler } from "recordrtc";

export class BaseRecorder {
  constructor() {
    this._isMediaDeviceSupport();
    this.isInitialized = false;
    this.stream = null;
    this.rtcRecorder = null;
  }

  async init() {
    // must be implemented
    return Promise.reject(new Error("[BaseRecorder]Not implemented"));
  }

  _isInitialized() {
    if (!this.isInitialized) {
      throw new Error("[BaseRecorder]Recorder is not initialized");
    }
  }

  _isMediaDeviceSupport() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw new Error("[BaseRecorder]browser not support navigator.mediaDevices API");
    }
  }

  async start() {
    this._isInitialized();
    return this.rtcRecorder.startRecording();
  }

  async stop() {
    this._isInitialized();
    await this.rtcRecorder.stopRecording();

    const blob = await this.rtcRecorder.getBlob();
    const url = URL.createObjectURL(blob);

    this.stream.getTracks().forEach(track => track.stop());
    await this.rtcRecorder.reset();
    await this.rtcRecorder.destroy();

    return {
      blob,
      url,
    };
  }
}

class AudioRecorder extends BaseRecorder {
  async init() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.rtcRecorder = new RecordRTCPromisesHandler(this.stream, {
      type: "audio",
      recorderType: RecordRTCPromisesHandler.StereoAudioRecorder,
    });
    this.isInitialized = true;
  }
}

class VideoRecorderAbstruct extends BaseRecorder {
  videoElement = null;

  async initStream() {
    throw new Error("[VideoRecorderAbstruct]Not implemented");
  }

  async init(el) {
    this.stream = await this.initStream();
    this.rtcRecorder = new RecordRTCPromisesHandler(this.stream, {
      type: "video",
      recorderType: RecordRTCPromisesHandler.MediaStreamRecorder,
    });
    this.initVideoElement(el);
    this.isInitialized = true;
  }

  initVideoElement(videoEl) {
    if (!(videoEl instanceof HTMLVideoElement)) {
      throw new Error("[Camera]paramter must be instanceof HTMLVideoElement");
    }
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.style.objectFit = "cover";
    videoEl.onloadedmetadata = () => videoEl.play();
    videoEl.srcObject = this.stream;
    this.videoElement = videoEl;
  }
}

class CameraRecorder extends VideoRecorderAbstruct {
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

export const createAudioRecorder = () => new AudioRecorder();
export const createCameraRecorder = () => new CameraRecorder();
export const createScreenRecorder = () => new ScreenRecorder();
