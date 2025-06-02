import type { Product } from '../types/product';

const categorySlugMap: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
};

export class ProductCardView {
  private element: HTMLButtonElement;

  constructor(product: Product, onClick: () => void) {
    const slug = categorySlugMap[product.category.toLowerCase()] || 'other';

    const btn = document.createElement('button');
    btn.className = 'gallery__item card';
    btn.innerHTML = `
      <span class="card__category card__category--${slug}">${product.category}</span>
      <h2 class="card__title">${product.title}</h2>
      <img class="card__image" src="${product.image}" alt="${product.title}" />
      <span class="card__price">${product.price} синапсов</span>
    `;

    btn.addEventListener('click', onClick);
    this.element = btn;
  }

  render(): HTMLButtonElement {
    return this.element;
  }
}
