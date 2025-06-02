import type { Product } from '../types/product';

export class ProductModalCardView {
  private element: HTMLElement;
  private addCallback: () => void = () => {};

  constructor(product: Product) {
    const el = document.createElement('div');
    el.className = 'card card_full';
    el.setAttribute('data-id', product.id);

    el.innerHTML = `
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

    const addButton = el.querySelector('.card__button') as HTMLButtonElement;
    addButton.addEventListener('click', () => this.addCallback());

    this.element = el;
  }

  onAddToCart(callback: (id: string) => void): void {
    this.addCallback = () => callback(this.getId());
  }

  private getId(): string {
    const id = this.element.getAttribute('data-id');
    if (!id) throw new Error('Product ID not found');
    return id;
  }

  render(): HTMLElement {
    return this.element;
  }
}

