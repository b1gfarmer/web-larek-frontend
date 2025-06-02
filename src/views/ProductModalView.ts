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
    this.container.innerHTML = '';
    this.currentCard = new ProductModalCardView(product);
    this.container.appendChild(this.currentCard.render());
    return this.container;
  }

  /**
   * Подписка на кнопку «В корзину».
   * Важно: currentCard уже должен быть создан (то есть, render() должен быть вызван до onAddToCart).
   */
  onAddToCart(callback: (id: string) => void): void {
    if (this.currentCard) {
      this.currentCard.onAddToCart(callback);
    }
  }
}
