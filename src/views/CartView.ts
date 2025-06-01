// src/views/CartView.ts

import type { CartItem } from '../types/cart';

interface CartViewItem {
  productId: string;
  title: string;
  price: number;
}

/**
 * View для отображения корзины.
 * Использует HTML-шаблоны <template id="basket"> и <template id="card-basket">,
 * чтобы не создавать элементы вручную каждый раз.
 */
export class CartView {
  private container: HTMLElement;

  // Шаблоны из index.html
  private basketTemplate: HTMLTemplateElement;
  private cardBasketTemplate: HTMLTemplateElement;

  // Элементы, к которым мы будем обращаться внутри корзины
  private listEl!: HTMLUListElement;
  private footerEl!: HTMLElement;
  private priceSpan!: HTMLElement;
  private checkoutBtn!: HTMLButtonElement;

  private onRemoveCallback: (productId: string) => void = () => {};
  private onCheckoutCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;

    // Находим шаблоны по id (они должны быть в index.html)
    const basketTpl = document.getElementById('basket') as HTMLTemplateElement | null;
    const cardBasketTpl = document.getElementById('card-basket') as HTMLTemplateElement | null;
    if (!basketTpl) throw new Error('<template id="basket"> not found');
    if (!cardBasketTpl) throw new Error('<template id="card-basket"> not found');
    this.basketTemplate = basketTpl;
    this.cardBasketTemplate = cardBasketTpl;
  }

  /**
   * Presenter подписывается на удаление товара.
   */
  onRemoveItem(callback: (productId: string) => void): void {
    this.onRemoveCallback = callback;
  }

  /**
   * Presenter подписывается на оформление заказа.
   */
  onCheckout(callback: () => void): void {
    this.onCheckoutCallback = callback;
  }

  /**
   * Рендерит корзину на основе готовых данных
   * (каждый элемент — { productId, title, price }).
   */
  render(items: CartViewItem[]): void {
    // Очищаем контейнер
    this.container.innerHTML = '';

    // Клонируем шаблон <template id="basket">
    const basketClone = (this.basketTemplate.content.cloneNode(true) as DocumentFragment);

    // Находим внутри склонированного фрагмента <ul class="basket__list">
    const listEl = basketClone.querySelector('.basket__list') as HTMLUListElement;
    if (!listEl) throw new Error('.basket__list not found in basket template');
    this.listEl = listEl;

    // Находим footer: контейнер для кнопки и цены
    const footerEl = basketClone.querySelector('.modal__actions') as HTMLDivElement;
    if (!footerEl) throw new Error('.modal__actions not found in basket template');
    this.footerEl = footerEl;

    // В footer есть <button class="button">Оформить</button>
    const checkoutBtn = footerEl.querySelector('button') as HTMLButtonElement;
    if (!checkoutBtn) throw new Error('button not found in basket footer');
    this.checkoutBtn = checkoutBtn;

    // И <span class="basket__price">...</span>
    const priceSpan = footerEl.querySelector('.basket__price') as HTMLElement;
    if (!priceSpan) throw new Error('.basket__price not found in basket footer');
    this.priceSpan = priceSpan;

    // Заполняем список товаров
    let sum = 0;
    items.forEach((item, idx) => {
      // Клонируем шаблон <template id="card-basket"> для каждого товара
      const cardClone = (this.cardBasketTemplate.content.cloneNode(true) as DocumentFragment);
      const li = cardClone.querySelector('li') as HTMLLIElement;
      if (!li) return;

      // Заполняем поля внутри <li>
      const indexSpan = li.querySelector('.basket__item-index') as HTMLElement;
      const titleSpan = li.querySelector('.card__title') as HTMLElement;
      const priceSpanLi = li.querySelector('.card__price') as HTMLElement;
      const delBtn = li.querySelector('.basket__item-delete') as HTMLButtonElement;

      indexSpan.textContent = (idx + 1).toString();
      titleSpan.textContent = item.title;
      priceSpanLi.textContent = `${item.price} синапсов`;

      // Навешиваем удаление
      delBtn.addEventListener('click', () => {
        this.onRemoveCallback(item.productId);
      });

      // Добавляем готовый <li> в <ul>
      this.listEl.appendChild(li);

      sum += item.price;
    });

    // Обновляем сумму в footer
    this.priceSpan.textContent = `${sum} синапсов`;

    // Делаем кнопку «Оформить» disabled, если корзина пуста
    const isEmpty = items.length === 0;
    if (isEmpty) {
      this.checkoutBtn.disabled = true;
    } else {
      this.checkoutBtn.disabled = false;
      // Навешиваем колбэк оформления
      this.checkoutBtn.addEventListener('click', () => {
        this.onCheckoutCallback();
      });
    }

    // Вставляем готовый фрагмент в контейнер
    this.container.appendChild(basketClone);
  }
}
