import type { Product } from '../types/product';

/**
 * Модель для хранения списка продуктов.
 * Теперь не делает запросы, а лишь сохраняет данные по setProducts().
 */
export class ProductsModel {
  private products: Product[] = [];

  /**
   * Коллбэк, вызываемый при обновлении списка продуктов.
   * Подписывать нужно до вызова setProducts().
   */
  public onUpdate?: (products: Product[]) => void;

  constructor() {}

  /**
   * Устанавливает список продуктов и уведомляет подписчика.
   */
  setProducts(items: Product[]): void {
    this.products = items;
    if (this.onUpdate) {
      this.onUpdate(this.products);
    }
  }

  /**
   * Возвращает копию массива всех сохранённых продуктов.
   */
  getAll(): Product[] {
    return [...this.products];
  }

  /**
   * Находит продукт по идентификатору.
   */
  getById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}
