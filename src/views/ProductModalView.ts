

import type { Product } from '../types/product';
import { ProductModalCardView } from './ProductModalCardView';

export class ProductModalView {
  public container: HTMLElement;
  private currentCard: ProductModalCardView | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Рисует карточку товара в модалке и возвращает контейнер.
   * После вызова render() можно подписываться на onAddToCart.
   */
  render(product: Product): HTMLElement {
    // Очищаем контейнер
    this.container.innerHTML = '';
    // Создаем новую карточку
    this.currentCard = new ProductModalCardView(product);
    // Вставляем в контейнер
    this.container.appendChild(this.currentCard.render());
    return this.container;
  }

  /**
   * Presenter подписывается на событие “Добавить в корзину”
   */
  onAddToCart(callback: (id: string) => void): void {
    if (this.currentCard) {
      this.currentCard.onAddToCart(callback);
    }
  }

  /**
   * Если карточка уже отрендерена, блокирует кнопку «В корзину»
   * (текст меняется на «Уже в корзине»).
   */
  disableAddButtonIfInCart(): void {
    if (this.currentCard) {
      this.currentCard.disableAsInCart();
    }
  }
}
