import { initScene } from './scenes/scene.js';
import { loadAvatar } from './utils/avatarLoader.js';
import { renderCatalog } from './components/catalog.js';

// Initialize Three.js scene
const { scene, camera, renderer } = initScene('three-canvas');

// Load default avatar
loadAvatar(scene, 'public/models/avatars/default.glb');

// Render clothing catalog
renderCatalog(document.getElementById('clothing-catalog'));
