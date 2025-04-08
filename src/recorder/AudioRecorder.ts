import { StereoAudioRecorder } from "recordrtc";
import { BaseRecorder } from "./BaseRecorder";

export class AudioRecorder extends BaseRecorder {
  constructor() {
    super({
      type: "audio",
      recorderType: StereoAudioRecorder,
    });
  }

  async initStream() {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  }
}

export const createAudioRecorder = () => new AudioRecorder();
