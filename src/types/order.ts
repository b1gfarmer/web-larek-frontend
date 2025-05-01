import type { CartItem } from './cart';

export type PaymentType = 'card' | 'cash';

export interface Order {
  items: CartItem[];
  address: string;
  paymentType: PaymentType;
  email: string;
  phone: string;
}
