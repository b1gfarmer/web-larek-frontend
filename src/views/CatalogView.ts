
import type { Product } from '../types/product';

export class CatalogView {
  private container: HTMLElement;
  private onProductClickCallback: (id: string) => void = () => {};

  constructor(containerSelector: string) {
    const el = document.querySelector(containerSelector);
    if (!el) throw new Error(`Catalog container not found: ${containerSelector}`);
    this.container = el as HTMLElement;
  }

  /** Позволяет Presenter-у подписаться на клик по карточке */
  onProductClick(callback: (id: string) => void): void {
    this.onProductClickCallback = callback;
  }

  /** Отрисовка массива продуктов */
  render(products: Product[]): void {
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
      btn.addEventListener('click', () => this.onProductClickCallback(p.id));
      this.container.appendChild(btn);
    });
  }
}
