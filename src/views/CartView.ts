

import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export class CartView {
  private container: HTMLElement;
  private onRemoveCallback: (id: string) => void = () => {};
  private onCheckoutCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /** Presenter подписывается на «удалить из корзины» */
  onRemoveItem(callback: (id: string) => void): void {
    this.onRemoveCallback = callback;
  }

  /** Presenter подписывается на «перейти к оформлению» */
  onCheckout(callback: () => void): void {
    this.onCheckoutCallback = callback;
  }

  /**
   * Рендерит список корзины, сумму и кнопку «Оформить».
   * Кнопка «Оформить» будет disabled, если items.length === 0.
   */
  render(items: CartItem[], products: Product[]): void {
    this.container.innerHTML = '';

    // Создаём список ul.basket__list и заполняем его товарами
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
        <span class="basket__item-index">${idx + 1}</span>
        <span class="card__title">${prod.title}</span>
        <span class="card__price">${prod.price} синапсов</span>
        <button class="basket__item-delete" aria-label="удалить"></button>
      `;
      const btnDel = li.querySelector('.basket__item-delete') as HTMLButtonElement;
      btnDel.addEventListener('click', () => this.onRemoveCallback(prod.id));
      list.appendChild(li);
    });

    // Если список пуст, в list ничего не будет. Но кнопка «Оформить» всё равно появится ниже — её нужно дизейблить.
    const footer = document.createElement('div');
    footer.className = 'modal__actions';

    // Проверяем, пуста ли корзина
    const isEmpty = items.length === 0;

    // Формируем footer: кнопка disabled, если корзина пустая; показываем сумму.
    footer.innerHTML = `
      <button class="button" ${isEmpty ? 'disabled' : ''}>Оформить</button>
      <span class="basket__price">${sum} синапсов</span>
    `;

    // Если корзина не пуста, подписываемся на клик «Оформить»
    // В любом случае, если корзина пустая, клик не сработает, потому что button.disabled === true.
    const orderBtn = footer.querySelector('button') as HTMLButtonElement;
    if (!isEmpty) {
      orderBtn.addEventListener('click', () => this.onCheckoutCallback());
    }

    // Вставляем элементы в контейнер
    this.container.appendChild(list);
    this.container.appendChild(footer);
  }
}
