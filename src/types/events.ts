
import type { Order } from './order';

export type AppEvent =
  | { type: 'productSelected', productId: string }
  | { type: 'addToCart', productId: string }
  | { type: 'removeFromCart', productId: string }
  | { type: 'openBasket' }
  | { type: 'orderSubmit', order: Order };

