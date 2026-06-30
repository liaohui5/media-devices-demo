# 项目概览

**项目名称**: `web-media-devices-demo` (v0.0.1)  
**许可证**: MIT  
**项目定位**: 使用浏览器 `navigator.mediaDevices` WebAPI 实现的录音/录摄像头/录屏/拍照 Demo，也可用于测试麦克风和摄像头硬件是否正常。

---

# 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 构建工具 | Vite | ^8.0 |
| UI 框架 | Vue 3 (Composition API, `<script setup>`) | ^3.5 |
| 语言 | TypeScript (strict 模式) | ^5.9 |
| CSS | Tailwind CSS (通过 `@tailwindcss/vite` 插件) | ^4.3 |
| 录制引擎 | RecordRTC (`RecordRTCPromisesHandler`) | ^5.6 |
| 浏览器兼容 | `webrtc-adapter` (垫片) | ^9.0 |
| 包管理器 | pnpm (CI 中使用 v11) | — |
| 类型检查 | vue-tsc | ^3.2 |

---

# 目录结构

```
.
├── index.html                     # 入口 HTML
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts                 # Vite 配置 (base: "/media-devices-demo/", @ 别名)
├── tsconfig.json                  # TS 项目引用 (app + node)
├── tsconfig.app.json              # 前端 TS 配置 (extends @vue/tsconfig, strict)
├── tsconfig.node.json             # Node 端 TS 配置 (vite.config.ts)
├── .editorconfig                  # 编辑器风格统一 (2空格缩进, LF换行, UTF-8)
├── .prettierrc                    # Prettier 格式化配置 (printWidth 120, 无尾逗号)
├── .gitignore
├── public/
│   └── vite.svg
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD (push main 触发)
├── src/
│   ├── main.ts                    # Vue 应用入口
│   ├── App.vue                    # 根组件 (布局 + 渲染四个子组件)
│   ├── style.css                  # 全局样式 (@import "tailwindcss")
│   ├── vite-env.d.ts              # Vite 类型声明
│   ├── AudioRecorder.vue          # 录音 UI 组件
│   ├── CameraRecorder.vue         # 录摄像头 UI 组件
│   ├── ScreenRecorder.vue         # 录屏 UI 组件
│   ├── TakePhoto.vue              # 拍照 UI 组件
│   └── recorder/                  # 核心录制逻辑层
│       ├── index.ts               # 统一导出 (引入 webrtc-adapter 垫片)
│       ├── BaseRecorder.ts        # 抽象基类
│       ├── AudioRecorder.ts       # 音频录制器
│       ├── VideoRecorder.ts       # 视频录制器 (摄像头 + 屏幕共享)
│       ├── Camera.ts              # 拍照器 (不使用 RecordRTC)
│       └── vue-hooks.ts           # Vue Composition API 封装
└── dist/                          # 构建产物
```

---

# 核心架构

## 抽象层 (`src/recorder/`)

### BaseRecorder (抽象基类)

文件: `src/recorder/BaseRecorder.ts`

- 封装 `RecordRTCPromisesHandler` 的完整生命周期
- **抽象方法**: `initStream()` — 子类必须实现，返回 `MediaStream`
- **公开方法**: `start()`, `pause()`, `resume()`, `stop()`
- `stop()` 的固定行为: 停止录制 → 获取 Blob → 停止所有 track → reset → destroy

### AudioRecorder

文件: `src/recorder/AudioRecorder.ts`

- 继承 `BaseRecorder`
- `initStream()`: 调用 `navigator.mediaDevices.getUserMedia({ audio: true })`
- 录制器类型: `StereoAudioRecorder`
- 导出工厂函数: `createAudioRecorder()`

### VideoRecorderAbstruct (抽象类)

文件: `src/recorder/VideoRecorder.ts`

- 继承 `BaseRecorder`
- 新增 `videoElement` 属性和 `initVideoElement()` 方法
- 初始化视频元素: 设置 `autoplay`, `muted`, `playsInline`, `objectFit: "cover"`, 绑定 `srcObject`
- 默认配置: `type: "video"`, `mimeType: "video/mp4"`, `recorderType: MediaStreamRecorder`

### CameraRecorder

文件: `src/recorder/VideoRecorder.ts`

- 继承 `VideoRecorderAbstruct`
- `initStream()`: `getUserMedia({ audio: true, video: true })` — 同时录制摄像头画面和麦克风音频
- 导出工厂函数: `createCameraRecorder()`

### ScreenRecorder

文件: `src/recorder/VideoRecorder.ts`

- 继承 `VideoRecorderAbstruct`
- `initStream()`: `navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })` — 录制屏幕+系统音频
- 导出工厂函数: `createScreenRecorder()`

### Camera (拍照器)

文件: `src/recorder/Camera.ts`

- 继承 `VideoRecorderAbstruct`
- **不依赖 RecordRTC**: 覆写了 `start()` 和 `stop()`，完全不用 `RecordRTCPromisesHandler`
- `initStream()`: `getUserMedia({ audio: false, video: true })` — 仅获取视频流
- `start()`: 创建内部 `<canvas>`，初始化视频流（不调用 RecordRTC）
- `stop(opts?)`: 通过 `canvas.drawImage()` 将视频当前帧绘制到 canvas，调用 `canvas.toBlob()` 生成图片
- 选项接口 `TakePhotoOptions`:
  - `imageType`: 支持 `image/png | image/jpeg | image/webp` (默认 png)
  - `quality`: 0~1 (默认 1)
  - `autoPauseVideo`: 拍照后是否暂停视频 (默认 true)
- 缩放计算: 支持 grow/shrink 两种模式，确保视频画面按比例填满 canvas
- 导出工厂函数: `createCamera()`

## Vue 组合式函数层

文件: `src/recorder/vue-hooks.ts`

### `internalRecorderFactory(options)`

内部工厂函数，创建以下响应式状态:

| 状态 | 类型 | 说明 |
|------|------|------|
| `previewDomRef` | `ref<HTMLVideoElement>` | 预览 video 元素引用 |
| `resultDomRef` | `ref` | 结果元素引用 (audio/video/img) |
| `resultBlob` | `ref<Blob>` | 录制结果的 Blob |
| `resultUrl` | `computed<string>` | 由 resultBlob 生成的 ObjectURL |

**生命周期**: `onMounted` 时实例化对应的 Recorder。

**方法**: `start()` (调用 recorder.start + 绑定预览) / `stop()` (调用 recorder.stop + 绑定结果)。

### 导出的组合式函数

| 函数 | 用途 | 对应的 Recorder 类 |
|------|------|-------------------|
| `useAudioRecorder()` | 录音 | AudioRecorder |
| `useCameraRecorder()` | 录摄像头 | CameraRecorder |
| `useScreenRecorder()` | 录屏 | ScreenRecorder |
| `useCameraTakePhoto()` | 拍照 | Camera |

## Vue 组件层

### App.vue

- 使用 Tailwind `container mx-auto` 居中布局
- 页面标题: "使用 navigator.mediaDevices WebAPI 录麦克风/录摄像头/录屏"
- 按顺序渲染四个子组件: AudioRecorder → TakePhoto → CameraRecorder → ScreenRecorder

### AudioRecorder.vue

- 两个按钮: "开始录音" / "结束录音"
- 状态提示文字 (音频未启动 / 请说话... / 录音已结束)
- `<audio>` 元素播放录制结果
- 使用 `useAudioRecorder()` 钩子

### TakePhoto.vue

- 两个按钮: "开始拍照" / "结束拍照"
- `<video>` 预览（应用了 `scale-x-[-1]` 镜像效果，自拍模式）
- `<img>` 显示拍照结果（也应用镜像效果）
- 固定尺寸: 480x640
- 使用 `useCameraTakePhoto()` 钩子

### CameraRecorder.vue

- 两个按钮: "开始录摄像头" / "结束录摄像头"
- 两个 `<video>`: 左为实时预览（黑底），右为录制回放
- 使用 `useCameraRecorder()` 钩子

### ScreenRecorder.vue

- 两个按钮: "开始录屏" / "结束录屏"
- 两个 `<video>`: 左为实时预览（黑底），右为录制回放
- 使用 `useScreenRecorder()` 钩子

---

# 构建与运行

```bash
pnpm dev       # 启动开发服务器 (端口 8080)
pnpm build     # vue-tsc 类型检查 + vite 构建
pnpm preview   # 预览构建产物
```

---

# CI/CD 流水线

文件: `.github/workflows/deploy.yml`

- 触发条件: push 到 `main` 分支
- 环境: ubuntu-latest, Node 24, pnpm 11
- 步骤: checkout → 安装依赖 → `pnpm build` → 配置 GitHub Pages → 上传 artifacts → Deploy
- **⚠️ 已知问题**: `upload-pages-artifact` 步骤的 `path` 配置为 `docs/.vitepress/dist`，疑似从 VitePress 项目复制而来未修改，实际应为 `./dist`。

---

# 注意事项

1. **浏览器兼容**: 入口通过 `import "webrtc-adapter"` 引入垫片，用于兼容旧浏览器
2. **路径别名**: `vite.config.ts` 设置了 `@` 别名指向 `/src`
3. **基础路径**: `base: "/media-devices-demo/"`，适配 GitHub Pages 子路径部署
4. **Tailwind CSS**: v4 版本，通过 Vite 插件集成，无需 PostCSS 配置文件
5. **拍照镜像**: TakePhoto 组件中 video 和 img 都使用了 `scale-x-[-1]` CSS 实现水平镜像
6. **录制器类型差异**: 
   - AudioRecorder → StereoAudioRecorder (WAV)
   - VideoRecorder 系列 → MediaStreamRecorder (MP4)
   - Camera (拍照) → 不使用 RecordRTC，纯 Canvas API
7. **代码风格**: Prettier 格式化 (printWidth=120, 无尾逗号, 单引号), EditorConfig (2空格缩进, LF)

---

# 扩展指南

- 新增录制类型: 继承 `BaseRecorder` 或 `VideoRecorderAbstruct`，实现 `initStream()`，在 `recorderFactoryMap` 中注册，在 `vue-hooks.ts` 中添加对应的组合式函数
- 修改默认录制参数: 在子类 `constructor` 中通过 `super(options)` 传入
