# 介绍

使用 WebAPI 录音/录屏 demo, 也可以用来测试电脑的硬件(比如电流麦)

```txt
.
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── node_modules
├── public
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── AudioRecorder.vue
│   ├── CameraRecorder.vue
│   ├── ScreenRecorder.vue
│   ├── TakePhoto.vue
│   ├── main.ts
│   ├── recorder
│   │   ├── AudioRecorder.ts
│   │   ├── BaseRecorder.ts
│   │   ├── Camera.ts
│   │   ├── VideoRecorder.ts
│   │   ├── index.ts
│   │   └── tools.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

4 directories, 23 files
```

## 录麦克风/录摄像头/拍照/录显示器

使用 [recordrtc](https://github.com/muaz-khan/RecordRTC) 实现
