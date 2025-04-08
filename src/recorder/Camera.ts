import { extend } from "./tools";
import { VideoRecorderAbstruct } from "./VideoRecorder";

export interface TakePhotoOptions {
  imageType: "image/png" | "image/jpeg" | "image/webp";
  quality: number;
  autoPauseVideo: boolean;
}

export class Camera extends VideoRecorderAbstruct {
  canvasElement?: HTMLCanvasElement;
  canvas2dContext: CanvasRenderingContext2D | null = null;

  // override
  async initStream() {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
  }

  // override: dont create RecordRTCPromisesHandler instance, because have not use it
  async start() {
    this.initCanvasElement();
    this.stream = await this.initStream();
  }
  initCanvasElement() {
    const canvas = document.createElement("canvas");
    this.canvasElement = canvas;
    this.canvas2dContext = canvas.getContext("2d");
  }

  // override: generate Blob object of picture
  async stop(opts?: TakePhotoOptions) {
    const defaultOpts = {
      imageType: "image/png",
      quality: 1,
      autoPauseVideo: true,
    };

    const options = extend(defaultOpts, opts);
    if (options.quality < 0 || options.quality > 1) {
      throw new RangeError("quality value must be between 0 and 1");
    }

    return this._draw(options);
  }

  private _draw(options: TakePhotoOptions) {
    const video = this.videoElement!;
    const canvas = this.canvasElement!;
    const { clientWidth, clientHeight, videoWidth, videoHeight } = video;

    // sync video element width and height to canvas
    canvas.width = clientWidth;
    canvas.height = clientHeight;

    const scaleX = clientWidth / videoWidth;
    const scaleY = clientHeight / videoHeight;
    const scale = Math.max(scaleX, scaleY);
    if (clientWidth > videoWidth) {
      // grow
      const scaledWidth = videoWidth * scale;
      const scaledHeight = videoHeight * scale;
      const offsetX = (clientWidth - scaledWidth) / 2;
      const offsetY = (clientHeight - scaledHeight) / 2;
      this.canvas2dContext!.drawImage(
        video,
        0,
        0,
        videoWidth,
        videoHeight,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight,
      );
    } else {
      // shrink
      const displayWidth = videoWidth * scale;
      const displayHeight = videoHeight * scale;
      const offsetX = (displayWidth - clientWidth) / 2;
      const offsetY = (displayHeight - clientHeight) / 2;
      this.canvas2dContext!.drawImage(
        video,
        offsetX / scale,
        offsetY / scale,
        clientWidth / scale,
        clientHeight / scale,
        0,
        0,
        clientWidth,
        clientHeight,
      );
    }

    const { imageType, quality, autoPauseVideo } = options;
    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          autoPauseVideo && video.pause();
          resolve(blob as Blob);
        },
        imageType,
        quality,
      );
    });
  }
}

export const createCamera = () => new Camera();
