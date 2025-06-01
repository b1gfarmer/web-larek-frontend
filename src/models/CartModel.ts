import type { CartItem } from '../types/cart';

/**
 * Модель корзины: хранит элементы, уведомляет об изменениях через onUpdate
 */
export class CartModel {
  private items: CartItem[] = [];

  /**
   * Коллбэк при обновлении содержимого корзины; 
   * его нужно обязательно установить извне перед использованием.
   */
  public onUpdate?: (items: CartItem[]) => void;

  /** Добавляет элемент и, если onUpdate задан, вызывает его */
  add(item: CartItem) {
    this.items.push(item);
    if (this.onUpdate) {
      this.onUpdate(this.getItems());
    }
  }

  /** Удаляет элемент по productId и вызывает onUpdate, если он задан */
  remove(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
    if (this.onUpdate) {
      this.onUpdate(this.getItems());
    }
  }

  /** Очищает корзину и вызывает onUpdate, если он задан */
  clear() {
    this.items = [];
    if (this.onUpdate) {
      this.onUpdate(this.getItems());
    }
  }

  /** Возвращает копию массива элементов */
  getItems(): CartItem[] {
    return [...this.items];
  }
}
