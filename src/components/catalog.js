let allItems = [];
let currentCategory = 'all';

export async function initCatalog(container) {
  const res = await fetch('src/data/catalog.json');
  const data = await res.json();
  allItems = data.items;
  render(container);

  // Category tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      render(container);
    });
  });

  // Listen for external deselect
  document.addEventListener('outfit:remove', (e) => {
    const { category } = e.detail;
    container.querySelectorAll(`.catalog-item[data-cat="${category}"]`).forEach(el => {
      el.classList.remove('selected');
    });
  });
}

function render(container) {
  const filtered = currentCategory === 'all'
    ? allItems
    : allItems.filter(i => i.category === currentCategory);

  container.innerHTML = filtered.map(item => `
    <div class="catalog-item" data-id="${item.id}" data-cat="${item.category}">
      <div class="item-thumb" style="background: ${item.color}22;">
        <span style="font-size:2.2rem">${item.emoji}</span>
      </div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-category">${capitalize(item.category)}</div>
      </div>
      <div class="item-badge">✓</div>
    </div>
  `).join('');

  container.querySelectorAll('.catalog-item').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const item = allItems.find(i => i.id === id);
      if (!item) return;

      const isSelected = card.classList.contains('selected');

      // Deselect others in same category
      container.querySelectorAll(`.catalog-item[data-cat="${item.category}"]`)
        .forEach(c => c.classList.remove('selected'));

      if (isSelected) {
        document.dispatchEvent(new CustomEvent('outfit:remove', { detail: { category: item.category } }));
      } else {
        card.classList.add('selected');
        document.dispatchEvent(new CustomEvent('outfit:select', { detail: item }));
      }
    });
  });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
