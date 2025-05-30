import type { CartItem } from '../types/cart';

/**
 * Модель корзины: хранит элементы, уведомляет об изменениях через onUpdate
 */
export class CartModel {
  private items: CartItem[] = [];

  /**
   * Коллбэк при обновлении содержимого корзины
   */
  public onUpdate: (items: CartItem[]) => void = () => {};

  /** Добавляет элемент и триггерит onUpdate */
  add(item: CartItem) {
    this.items.push(item);
    this.onUpdate(this.getItems());
  }

  /** Удаляет элемент по productId */
  remove(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.onUpdate(this.getItems());
  }

  /** Очищает корзину */
  clear() {
    this.items = [];
    this.onUpdate(this.getItems());
  }

  /** Возвращает копию массива элементов */
  getItems(): CartItem[] {
    return [...this.items];
  }
}
