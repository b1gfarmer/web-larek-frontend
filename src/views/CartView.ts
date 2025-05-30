
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export class CartView {
  constructor(
    private container: HTMLElement,
    private onRemove: (id: string) => void,
    private onCheckout: () => void
  ) {}

  render(items: CartItem[], products: Product[]) {
    this.container.innerHTML = '';
    const list = document.createElement('ul');
    list.className = 'basket__list';
    let sum = 0;
    items.forEach((item, idx) => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return;
      sum += prod.price;
      const li = document.createElement('li');
      li.className = 'basket__item card card_compact';
      li.innerHTML = `
        <span class="basket__item-index">${idx+1}</span>
        <span class="card__title">${prod.title}</span>
        <span class="card__price">${prod.price} синапсов</span>
        <button class="basket__item-delete" aria-label="удалить"></button>
      `;
      li.querySelector('.basket__item-delete')!
        .addEventListener('click', () => this.onRemove(prod.id));
      list.appendChild(li);
    });
    const footer = document.createElement('div');
    footer.className = 'modal__actions';
    footer.innerHTML = `<button class="button">Оформить</button><span class="basket__price">${sum} синапсов</span>`;
    footer.querySelector('button')!.addEventListener('click', () => this.onCheckout());
    this.container.appendChild(list);
    this.container.appendChild(footer);
  }
}