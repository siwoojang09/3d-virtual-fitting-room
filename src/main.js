import { initScene, resetCamera, toggleBackground } from './scenes/scene.js';
import { loadPresetAvatar, loadAvatarFromURL, applyBodyParams } from './utils/avatarLoader.js';
import { equipItem, unequipItem, clearOutfit } from './utils/outfitManager.js';
import { initCatalog } from './components/catalog.js';

// ── Init scene
const { scene } = initScene('three-canvas');

// ── Catalog
initCatalog(document.getElementById('clothing-catalog'));

// ── Load default avatar (male preset mannequin)
loadPresetAvatar(scene, 'male');

// ── Toolbar buttons
document.getElementById('btn-reset-cam').addEventListener('click', resetCamera);
document.getElementById('btn-toggle-bg').addEventListener('click', toggleBackground);

// ── Preset avatar buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadPresetAvatar(scene, btn.dataset.preset);
  });
});

// ── Ready Player Me modal
const rpmModal = document.getElementById('rpm-modal');
const rpmIframe = document.getElementById('rpm-iframe');

document.getElementById('btn-open-rpm').addEventListener('click', () => {
  rpmModal.classList.remove('hidden');
});
document.getElementById('rpm-close').addEventListener('click', () => {
  rpmModal.classList.add('hidden');
});
document.getElementById('rpm-overlay').addEventListener('click', () => {
  rpmModal.classList.add('hidden');
});

// Listen for RPM avatar URL message
window.addEventListener('message', (event) => {
  if (event.data?.source === 'readyplayerme' && event.data?.eventName === 'v1.avatar.exported') {
    const url = event.data.data?.url;
    if (url) {
      rpmModal.classList.add('hidden');
      loadAvatarFromURL(scene, url, () => {
        document.getElementById('avatar-preview-box').innerHTML = `
          <div style="text-align:center;color:#5c6ef8;padding:12px">
            <span style="font-size:2rem">✓</span>
            <p style="font-size:0.75rem;margin-top:4px;font-weight:600">Avatar loaded!</p>
          </div>`;
      });
    }
  }
});

// ── Body measurement sliders
const sliders = [
  { id: 'slider-height', valId: 'val-height', key: 'height' },
  { id: 'slider-weight', valId: 'val-weight', key: 'weight' },
  { id: 'slider-shoulder', valId: 'val-shoulder', key: 'shoulder' },
];

const bodyParams = { height: 175, weight: 70, shoulder: 42 };

sliders.forEach(({ id, valId, key }) => {
  const slider = document.getElementById(id);
  const val = document.getElementById(valId);
  slider.addEventListener('input', () => {
    val.textContent = slider.value;
    bodyParams[key] = Number(slider.value);
    applyBodyParams(bodyParams);
  });
});

// ── Outfit events
document.addEventListener('outfit:select', (e) => {
  equipItem(scene, e.detail);
});

document.addEventListener('outfit:remove', (e) => {
  unequipItem(scene, e.detail.category);
});

document.getElementById('btn-clear-outfit').addEventListener('click', () => {
  clearOutfit(scene);
  document.querySelectorAll('.catalog-item.selected').forEach(el => el.classList.remove('selected'));
});
