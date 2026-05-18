// Manages the currently equipped clothing items on the avatar
const equippedItems = {};

export function equipItem(scene, category, model) {
  if (equippedItems[category]) {
    scene.remove(equippedItems[category]);
  }
  equippedItems[category] = model;
  scene.add(model);
}

export function unequipItem(scene, category) {
  if (equippedItems[category]) {
    scene.remove(equippedItems[category]);
    delete equippedItems[category];
  }
}

export function getEquipped() {
  return { ...equippedItems };
}
