import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let currentAvatar = null;

export function loadAvatar(scene, url) {
  if (currentAvatar) scene.remove(currentAvatar);
  loader.load(url, (gltf) => {
    currentAvatar = gltf.scene;
    scene.add(currentAvatar);
  });
}

export function loadClothingItem(scene, url) {
  loader.load(url, (gltf) => {
    const item = gltf.scene;
    scene.add(item);
  });
}
