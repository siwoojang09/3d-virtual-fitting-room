# 3D Virtual Fitting Room

A portfolio project showcasing a 3D virtual fitting room experience built with **Three.js** and **Ready Player Me**.

## Features
- 🧍 Full 3D avatar with customizable body type, height, and skin tone
- 👗 Real-time clothing try-on with `.glb` 3D garment models
- 🔄 360° avatar rotation and zoom
- 🛍️ Outfit catalog to browse and swap items

## Tech Stack
- [Three.js](https://threejs.org/) — 3D rendering
- [Ready Player Me](https://readyplayer.me/) — Avatar generation
- Vanilla JS / HTML / CSS (no framework, keep it clean)

## Project Structure
```
3d-virtual-fitting-room/
├── public/
│   ├── models/
│   │   ├── clothing/       # .glb clothing models
│   │   └── avatars/        # cached avatar models
│   └── textures/           # fabric/material textures
├── src/
│   ├── components/         # UI components (catalog, controls)
│   ├── scenes/             # Three.js scene setup
│   ├── utils/              # helpers (loader, avatar, outfit manager)
│   ├── data/               # clothing catalog JSON
│   └── styles/             # CSS
├── index.html
└── README.md
```

## Getting Started
```bash
# Clone the repo
git clone https://github.com/siwoojang09/3d-virtual-fitting-room.git
cd 3d-virtual-fitting-room

# Open in browser (no build step needed)
open index.html
# or use Live Server in VS Code
```
