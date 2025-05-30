import type { Product } from '../types/product';
import type { ApiClient } from '../types/api';

/**
 * Модель для загрузки и хранения списка продуктов.
 * Использует ApiClient для получения данных и уведомляет об обновлениях через onUpdate.
 */
export class ProductsModel {
  private apiClient: ApiClient;
  private products: Product[] = [];

  /**
   * Колбэк, вызываемый при обновлении списка продуктов.
   * Подписывать нужно до вызова load().
   */
  public onUpdate: (products: Product[]) => void = () => {};

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Загружает продукты с сервера и уведомляет подписчика.
   */
  async load(): Promise<void> {
    const items = await this.apiClient.getProducts();
    this.products = items;
    this.onUpdate(this.products);
  }

  /**
   * Возвращает копию массива всех загруженных продуктов.
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