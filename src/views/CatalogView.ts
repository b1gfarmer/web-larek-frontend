
import type { Product } from '../types/product';

export class CatalogView {
  private container: HTMLElement;
  private onProductClick: (id: string) => void;

  constructor(containerSelector: string, onProductClick: (id: string) => void) {
    const el = document.querySelector(containerSelector);
    if (!el) throw new Error(`Container not found: ${containerSelector}`);
    this.container = el as HTMLElement;
    this.onProductClick = onProductClick;
  }

  render(products: Product[]) {
  this.container.innerHTML = '';

  const categorySlugMap: Record<string, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button'
  };

  products.forEach(p => {
    const slug = categorySlugMap[p.category.toLowerCase()] || 'other';

    const btn = document.createElement('button');
    btn.className = 'gallery__item card';
    btn.innerHTML = `
      <span class="card__category card__category--${slug}">${p.category}</span>
      <h2 class="card__title">${p.title}</h2>
      <img class="card__image" src="${p.image}" alt="${p.title}" />
      <span class="card__price">${p.price} синапсов</span>
    `;
    btn.addEventListener('click', () => this.onProductClick(p.id));
    this.container.appendChild(btn);
  });
}

}