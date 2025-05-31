
import type { Product } from '../types/product';

export class ProductModalView {
  private container: HTMLElement;
  private onAddCallback: (id: string) => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /** Позволяет Presenter-у подписаться на «Добавить в корзину» */
  onAddToCart(callback: (id: string) => void): void {
    this.onAddCallback = callback;
  }

  /** Рисует полную карточку товара в модалке */
  render(product: Product): void {
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
    const btn = card.querySelector('button.card__button') as HTMLButtonElement;
    btn.addEventListener('click', () => this.onAddCallback(product.id));
    this.container.appendChild(card);
  }
}
