
import { Api } from './components/base/api';
import type { Product } from './types/product';
import type { Order } from './types/order';
import type { ApiClient, OrderResponse } from './types/api';

const baseUrl = 'https://larek-api.nomoreparties.co/api/weblarek';

class ApiClientImpl implements ApiClient {
  private api: Api;

  constructor() {
    this.api = new Api(baseUrl);
  }

  async getProducts(): Promise<Product[]> {
    const data = await this.api.get('/product/');
    const items = (data as { items: Product[] }).items;

    return items.map((item) => ({
      ...item,
      image: `https://larek-api.nomoreparties.co/content/weblarek${item.image}`, 
    }));
  }

  async makeOrder(order: Order): Promise<OrderResponse> {
    const result = await this.api.post('/order', order);
    return result as OrderResponse;
  }
}

export const apiClient = new ApiClientImpl();
