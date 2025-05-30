

import type { Product } from '../types/product';

export class ProductModalView {
  constructor(private container: HTMLElement, private onAdd: (id: string) => void) {}

  render(product: Product) {
    this.container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card card_full';
    card.innerHTML = `
      <img class="card__image" src="${product.image}" alt="${product.title}" />
      <div class="card__column">
        <span class="card__category card__category_other">${product.category}</span>
        <h2 class="card__title">${product.title}</h2>
        <p class="card__text">${product.description}</p>
        <div class="card__row">
          <button class="button card__button">В корзину</button>
          <span class="card__price">${product.price} синапсов</span>
        </div>
      </div>
    `;
    card.querySelector('button.card__button')!
      .addEventListener('click', () => this.onAdd(product.id));
    this.container.appendChild(card);
  }
}