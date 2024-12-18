const isCallable = (fn) => typeof fn === "function";
const extend = Object.assign;

class Camera {
  constructor(videoEle) {
    this.isMediaDevicesSupport();
    this.isInitialized = false;
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.canvas2dContext = null;
    this.init(videoEle);
  }

  isMediaDevicesSupport() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      throw new Error("[Camera]browser not support navigator.mediaDevices API");
    }
  }

  init(videoEle) {
    this._initVideoElement(videoEle);
    this._initCanvasElement();
  }

  _initVideoElement(videoEle) {
    if (!(videoEle instanceof HTMLVideoElement)) {
      throw new Error("[Camera]paramter must be instanceof HTMLVideoElement");
    }
    videoEle.autoplay = true;
    videoEle.muted = true;
    videoEle.playsInline = true;
    videoEle.style.objectFit = "cover";
    this.videoElement = videoEle;
  }

  _initCanvasElement() {
    const canvas = document.createElement("canvas");
    this.canvasElement = canvas;
    this.canvas2dContext = canvas.getContext("2d");
  }

  start(opts = {}) {
    if (this.isInitialized) {
      return;
    }

    const options = extend({
      onError: (err) => {
        console.error("[Camera]fail to start camera:", err);
      },
      onReady: ({ videoElement, stream }) => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => videoElement.play();
      },
      onStarted: null,
      onFinal: null,
      videoConstraints: true,
    }, opts);

    const { onReady, onStarted, onError, onFinal, videoConstraints } = options;

    return navigator.mediaDevices.getUserMedia({
      // please visit mdn docs for more details:
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      video: videoConstraints,
      audio: false,
    })
      .then((stream) => {
        this.stream = stream;
        isCallable(onReady) && onReady(this);
        isCallable(onStarted) && onStarted(this);
      })
      .catch((err) => {
        isCallable(onError) && onError(err);
      })
      .finally(() => {
        this.isInitialized = true;
        isCallable(onFinal) && onFinal(this);
      });
  }

  stop() {
    if (!this.isInitialized) {
      return;
    }

    this.stream.getTracks().forEach((track) => track.stop());
    this.isInitialized = false;
  }

  // 注意点: 因为无法随意设置摄像头的尺寸,
  // 那么在使用canvas绘图的时候就不能直接绘制视频流的尺寸
  // 而是应该绘制 video 元素的尺寸, 因为 video 元素的尺寸是可以
  // 可以通过css随意控制的, 只需要给 video 设置 object-fit: cover
  // 就可以让视频拉伸覆盖整个 video 元素
  takePhoto(opts = {}) {
    if (!this.isInitialized) {
      throw new Error("[Camera]please start camera first");
    }

    const video = this.videoElement;
    const canvas = this.canvasElement;
    const {
      clientWidth: containerWidth,
      clientHeight: containerHeight,
      videoWidth,
      videoHeight,
    } = video;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const scaleX = containerWidth / videoWidth;
    const scaleY = containerHeight / videoHeight;
    const scale = Math.max(scaleX, scaleY);
    if (containerWidth > videoWidth) {
      // grow
      const scaledWidth = videoWidth * scale;
      const scaledHeight = videoHeight * scale;
      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;
      this.canvas2dContext.drawImage(
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
      const offsetX = (displayWidth - containerWidth) / 2;
      const offsetY = (displayHeight - containerHeight) / 2;
      this.canvas2dContext.drawImage(
        video,
        offsetX / scale,
        offsetY / scale,
        containerWidth / scale,
        containerHeight / scale,
        0,
        0,
        containerWidth,
        containerHeight,
      );
    }

    // canvas.toBlob options:
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Syntax
    const options = extend({
      imageType: "image/png",
      quality: 1,
      autoPauseVideo: true,
    }, opts);

    const allowImageTypes = ["image/png", "image/jpeg"];
    if (!allowImageTypes.includes(options.imageType)) {
      throw new Error("[Camera]only support image/png and image/jpeg");
    }
    if (options.quality < 0 || options.quality > 1) {
      throw new RangeError("[Camera]quality must be between 0 and 1");
    }

    const { imageType, quality, autoPauseVideo } = options;
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          autoPauseVideo && this.videoElement.pause();
          resolve({ blob, url });
        },
        imageType,
        quality,
      );
    });
  }
}

export const createCamera = (videoEle) => new Camera(videoEle);
