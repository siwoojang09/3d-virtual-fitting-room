import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';

const equipped = {}; // { category: { item, mesh } }

// Color map for visual clothing representation
const CATEGORY_GEOMETRY = {
  top: () => new THREE.CapsuleGeometry(0.195, 0.44, 8, 16),
  bottom: () => new THREE.CapsuleGeometry(0.19, 0.50, 8, 16),
  outerwear: () => new THREE.CapsuleGeometry(0.215, 0.55, 8, 16),
  shoes: () => new THREE.BoxGeometry(0.11, 0.07, 0.22),
};

const CATEGORY_POSITION = {
  top: new THREE.Vector3(0, 1.12, 0),
  bottom: new THREE.Vector3(0, 0.60, 0),
  outerwear: new THREE.Vector3(0, 1.14, 0.01),
  shoes: null, // handled separately
};

export function equipItem(scene, item) {
  unequipItem(scene, item.category);

  const geo = CATEGORY_GEOMETRY[item.category]?.();
  if (!geo) return;

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(item.color || '#888'),
    roughness: 0.75,
    metalness: 0.05,
    transparent: true,
    opacity: 0.92,
  });

  let mesh;

  if (item.category === 'shoes') {
    const group = new THREE.Group();
    [-1, 1].forEach(side => {
      const shoe = new THREE.Mesh(CATEGORY_GEOMETRY.shoes(), mat.clone());
      shoe.position.set(side * 0.1, 0.04, 0.04);
      shoe.castShadow = true;
      group.add(shoe);
    });
    mesh = group;
  } else {
    mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    const pos = CATEGORY_POSITION[item.category];
    if (pos) mesh.position.copy(pos);
  }

  // Animate in
  mesh.scale.set(0.01, 0.01, 0.01);
  scene.add(mesh);
  equipped[item.category] = { item, mesh };
  animateIn(mesh);

  updateSummary();
  return mesh;
}

export function unequipItem(scene, category) {
  if (equipped[category]) {
    scene.remove(equipped[category].mesh);
    delete equipped[category];
    updateSummary();
  }
}

export function clearOutfit(scene) {
  Object.keys(equipped).forEach(cat => unequipItem(scene, cat));
}

export function getEquipped() {
  return Object.fromEntries(
    Object.entries(equipped).map(([k, v]) => [k, v.item])
  );
}

function animateIn(mesh) {
  const target = 1;
  let progress = 0;
  function tick() {
    progress = Math.min(progress + 0.08, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    mesh.scale.setScalar(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  tick();
}

function updateSummary() {
  const container = document.getElementById('outfit-summary');
  if (!container) return;
  const items = Object.values(equipped);
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-msg">No items selected yet.</p>';
    return;
  }
  container.innerHTML = items.map(({ item }) => `
    <span class="outfit-tag" data-cat="${item.category}">
      ${item.emoji || '👕'} ${item.name}
      <span class="remove-tag" data-cat="${item.category}">✕</span>
    </span>
  `).join('');

  container.querySelectorAll('.remove-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('outfit:remove', { detail: { category: btn.dataset.cat } }));
    });
  });
}
