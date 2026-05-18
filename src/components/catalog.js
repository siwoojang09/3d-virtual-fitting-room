import catalog from '../data/catalog.json' assert { type: 'json' };

export function renderCatalog(container) {
  container.innerHTML = '';
  catalog.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'catalog-item';
    card.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.name}" />
      <span>${item.name}</span>
    `;
    card.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('outfit:select', { detail: item }));
    });
    container.appendChild(card);
  });
}
