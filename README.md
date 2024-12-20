# 介绍

使用 WebAPI 录音/录屏 demo, 也可以用来测试电脑的硬件(比如电流麦)

```txt
.
├── README.md
├── dprint.json
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── camera.js         # 拍照实现
│   ├── main.js
│   ├── recorder.js       # 录音/录屏实现
│   ├── style.css
│   └── take-phoeo.vue
├── tailwind.config.js    # tailwind 配置文件
└── vite.config.js

3 directories, 15 files
```

## 拍照

使用 原生js实现

## 录麦克风/录摄像头/录显示器

使用 [recordrtc](https://github.com/muaz-khan/RecordRTC) 实现

