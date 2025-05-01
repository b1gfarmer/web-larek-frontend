import type { Product } from './product';
import type { Order } from './order';

export interface ApiClient {
  getProducts(): Promise<Product[]>;
  makeOrder(order: Order): Promise<OrderResponse>;
}

export interface OrderResponse {
  success: boolean;
  total: number;
}
