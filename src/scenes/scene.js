import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let bgMode = 0;
const bgColors = [0x1a1a2e, 0xf5f5f7, 0x2d2d44];

export function initScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  const parent = canvas.parentElement;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColors[0]);
  scene.fog = new THREE.FogExp2(bgColors[0], 0.06);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.4, 3.2);

  // Lighting rig
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(2, 4, 3);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xb0c4ff, 0.6);
  fill.position.set(-3, 2, -1);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffeedd, 0.4);
  rim.position.set(0, 3, -4);
  scene.add(rim);

  // Floor
  const floorGeo = new THREE.CircleGeometry(2, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x333355,
    roughness: 0.8,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Subtle grid
  const gridHelper = new THREE.GridHelper(4, 10, 0x444466, 0x333355);
  gridHelper.position.y = 0.001;
  scene.add(gridHelper);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.2;
  controls.maxDistance = 7;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI / 2 + 0.1;
  controls.update();

  // Resize
  function resize() {
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return { scene, camera, renderer, controls };
}

export function resetCamera() {
  camera.position.set(0, 1.4, 3.2);
  controls.target.set(0, 1, 0);
  controls.update();
}

export function toggleBackground() {
  bgMode = (bgMode + 1) % bgColors.length;
  const c = bgColors[bgMode];
  scene.background = new THREE.Color(c);
  scene.fog = new THREE.FogExp2(c, 0.06);
}
