

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

  /** Добавляет элемент, но только если его там ещё нет */
  add(item: CartItem) {
    const exists = this.items.some(i => i.productId === item.productId);
    if (!exists) {
      this.items.push(item);
      this.onUpdate?.(this.getItems());
    }
    // Если товар уже был — просто игнорируем, не вызываем onUpdate
  }

  /** Удаляет элемент по productId и вызывает onUpdate, если он задан */
  remove(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.onUpdate?.(this.getItems());
  }

  /** Очищает корзину и вызывает onUpdate, если он задан */
  clear() {
    this.items = [];
    this.onUpdate?.(this.getItems());
  }

  /** Возвращает копию массива элементов */
  getItems(): CartItem[] {
    return [...this.items];
  }
}
