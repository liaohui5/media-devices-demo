import { RecordRTCPromisesHandler, type Options } from "recordrtc";
import { extend } from "./tools";

export abstract class BaseRecorder {
  stream?: MediaStream;
  rtcRecorder?: RecordRTCPromisesHandler;
  options?: Options;

  // must be implemented, resolve MediaStream
  abstract initStream(): Promise<MediaStream>;

  constructor(options?: Options) {
    const defaultOptions: Options = {
      disableLogs: true,
    };
    this.options = extend(defaultOptions, options);
  }

  async initRecorder(options?: Options): Promise<void> {
    const stream = await this.initStream();
    this.stream = stream;
    this.rtcRecorder = new RecordRTCPromisesHandler(stream, options);
  }

  async start(options?: Options) {
    await this.initRecorder(options);
    return this.rtcRecorder?.startRecording();
  }

  async pause() {
    return this.rtcRecorder?.pauseRecording();
  }

  async resume() {
    return this.rtcRecorder?.resumeRecording();
  }

  async stop() {
    await this.rtcRecorder?.stopRecording();

    const blob = await this.rtcRecorder?.getBlob();

    this.stream?.getTracks().forEach((track) => track.stop());
    await this.rtcRecorder?.reset();
    await this.rtcRecorder?.destroy();

    return blob;
  }
}
