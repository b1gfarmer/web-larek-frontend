import type { Product } from './product';
import type { Order, OrderResponse } from './order';

export interface ApiClient {
  getProducts(): Promise<Product[]>;
  makeOrder(order: Order): Promise<OrderResponse>;
}
