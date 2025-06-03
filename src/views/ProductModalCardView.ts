

import type { Product } from '../types/product';

export class ProductModalCardView {
  private element: HTMLElement;
  private addButton: HTMLButtonElement;
  private addCallback: (productId: string) => void = () => {};

  constructor(product: Product) {
    // Клонируем шаблон <template id="card-preview"> из index.html
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const cloned = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Присваиваем data-id на корневом .card_full
    cloned.setAttribute('data-id', product.id);

    // Заполняем картинку
    const imgEl = cloned.querySelector('.card__image') as HTMLImageElement;
    imgEl.src = product.image;
    imgEl.alt = product.title;

    // Категория
    const categoryEl = cloned.querySelector('.card__category') as HTMLElement;
    categoryEl.textContent = product.category || '';

    // Заголовок
    const titleEl = cloned.querySelector('.card__title') as HTMLElement;
    titleEl.textContent = product.title;

    // Описание
    const descriptionEl = cloned.querySelector('.card__text') as HTMLElement;
    descriptionEl.textContent = product.description || '';

    // Цена
    const priceEl = cloned.querySelector('.card__price') as HTMLElement;
    priceEl.textContent = product.price != null ? `${product.price} синапсов` : '0 синапсов';

    // Кнопка “В корзину”
    this.addButton = cloned.querySelector('.card__button') as HTMLButtonElement;

    // Если у товара нет цены (null или 0) — сразу блокируем кнопку
    if (product.price == null || product.price === 0) {
      this.disableAsUnavailable();
    }

    // Навешиваем коллбэк на кнопку “В корзину”
    this.addButton.addEventListener('click', () => {
      const id = this.getId();
      this.addCallback(id);
      // После того как кликнули, сразу блокируем кнопку, 
      // чтобы пользователь не мог кликать ещё раз
      this.disableAsInCart();
    });

    this.element = cloned;
  }

  /**
   * Presenter подписывается на событие “Добавить в корзину”
   */
  onAddToCart(callback: (id: string) => void): void {
    this.addCallback = callback;
  }

  /**
   * Возвращает ID текущего товара из data-id
   */
  private getId(): string {
    const id = this.element.getAttribute('data-id');
    if (!id) {
      throw new Error('Product ID not found in ProductModalCardView');
    }
    return id;
  }

  /**
   * Блокирует кнопку «В корзину» и меняет текст на «Уже в корзине»
   */
  public disableAsInCart(): void {
    this.addButton.disabled = true;
    this.addButton.textContent = 'Уже в корзине';
    this.addButton.classList.add('button_disabled');
  }

  /**
   * Блокирует кнопку «В корзину» (товар без цены) и меняет текст на «Нет в продаже»
   */
  private disableAsUnavailable(): void {
    this.addButton.disabled = true;
    this.addButton.textContent = 'Нет в продаже';
    this.addButton.classList.add('button_disabled');
  }

  render(): HTMLElement {
    return this.element;
  }
}
