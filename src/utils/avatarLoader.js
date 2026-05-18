import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let currentAvatar = null;

// Preset avatar URLs from Ready Player Me public demo
const PRESETS = {
  male: 'https://models.readyplayer.me/64c3f5c5c9e72e9c6a67de4b.glb?morphTargets=ARKit&textureAtlas=1024',
  female: 'https://models.readyplayer.me/64c3f5c5c9e72e9c6a67de4b.glb?morphTargets=ARKit&textureAtlas=1024',
};

// Fallback: procedural mannequin if GLB fails
function createMannequin(scene, bodyParams = {}) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xc8a87a, roughness: 0.7, metalness: 0 });

  const { scale = 1 } = bodyParams;

  // Torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18 * scale, 0.45 * scale, 8, 16), mat);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13 * scale, 16, 16), mat);
  head.position.y = 1.65;
  head.castShadow = true;
  group.add(head);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * scale, 0.055 * scale, 0.1 * scale), mat);
  neck.position.y = 1.52;
  group.add(neck);

  // Arms
  [-1, 1].forEach(side => {
    const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.065 * scale, 0.25 * scale, 8, 8), mat);
    upperArm.position.set(side * 0.28 * scale, 1.22, 0);
    upperArm.rotation.z = side * 0.18;
    upperArm.castShadow = true;
    group.add(upperArm);

    const foreArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055 * scale, 0.22 * scale, 8, 8), mat);
    foreArm.position.set(side * 0.33 * scale, 0.92, 0);
    foreArm.rotation.z = side * 0.12;
    foreArm.castShadow = true;
    group.add(foreArm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055 * scale, 8, 8), mat);
    hand.position.set(side * 0.37 * scale, 0.74, 0);
    hand.castShadow = true;
    group.add(hand);
  });

  // Hips
  const hips = new THREE.Mesh(new THREE.CapsuleGeometry(0.20 * scale, 0.1 * scale, 8, 8), mat);
  hips.position.y = 0.82;
  group.add(hips);

  // Legs
  [-1, 1].forEach(side => {
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085 * scale, 0.32 * scale, 8, 8), mat);
    thigh.position.set(side * 0.1 * scale, 0.55, 0);
    thigh.castShadow = true;
    group.add(thigh);

    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065 * scale, 0.28 * scale, 8, 8), mat);
    shin.position.set(side * 0.1 * scale, 0.22, 0);
    shin.castShadow = true;
    group.add(shin);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.09 * scale, 0.06 * scale, 0.18 * scale), mat);
    foot.position.set(side * 0.1 * scale, 0.04, 0.04);
    foot.castShadow = true;
    group.add(foot);
  });

  if (currentAvatar) scene.remove(currentAvatar);
  currentAvatar = group;
  scene.add(group);
  return group;
}

export function loadAvatarFromURL(scene, url, onDone) {
  showLoading(true);
  loader.load(
    url,
    (gltf) => {
      if (currentAvatar) scene.remove(currentAvatar);
      currentAvatar = gltf.scene;
      currentAvatar.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // Center at feet
      const box = new THREE.Box3().setFromObject(currentAvatar);
      currentAvatar.position.y -= box.min.y;
      scene.add(currentAvatar);
      showLoading(false);
      if (onDone) onDone(currentAvatar);
    },
    undefined,
    (err) => {
      console.warn('GLB load failed, using mannequin:', err);
      createMannequin(scene);
      showLoading(false);
      if (onDone) onDone(currentAvatar);
    }
  );
}

export function loadPresetAvatar(scene, preset, onDone) {
  // Use mannequin as reliable fallback for portfolio demo
  showLoading(true);
  setTimeout(() => {
    const bodyParams = { scale: preset === 'female' ? 0.94 : 1 };
    const avatar = createMannequin(scene, bodyParams);
    showLoading(false);
    if (onDone) onDone(avatar);
  }, 600);
}

export function applyBodyParams(params) {
  if (!currentAvatar) return;
  const heightScale = params.height / 175;
  const weightScale = 0.85 + (params.weight - 45) / (130 - 45) * 0.3;
  currentAvatar.scale.set(weightScale, heightScale, weightScale);
}

export function getCurrentAvatar() { return currentAvatar; }

function showLoading(show) {
  const el = document.getElementById('loading-overlay');
  if (el) el.classList.toggle('hidden', !show);
}
