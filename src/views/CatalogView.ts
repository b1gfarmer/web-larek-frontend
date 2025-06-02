import type { Product } from '../types/product';

export class CatalogView {
  private container: HTMLElement;
  private onProductClickCallback: (id: string) => void = () => {};

  constructor(containerSelector: string) {
    const el = document.querySelector(containerSelector);
    if (!el) throw new Error(`Catalog container not found: ${containerSelector}`);
    this.container = el as HTMLElement;
  }

  /** Подписка на клик по товару */
  onProductClick(callback: (id: string) => void): void {
    this.onProductClickCallback = callback;
  }

  /** Очистка и наполнение каталога готовыми карточками */
  setCards(cards: HTMLElement[]): void {
    this.container.innerHTML = '';
    cards.forEach(card => this.container.appendChild(card));
  }

  /** Возврат контейнера — строго по архитектуре */
  render(): HTMLElement {
    return this.container;
  }
}
