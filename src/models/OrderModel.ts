import type { CartItem } from '../types/cart';

// Интерфейс для payload-а, который мы отправляем на сервер:
export interface OrderPayload {
  items: string[];          
  payment: 'card' | 'cash'; 
  address: string;
  email: string;
  phone: string;
  total: number;            
}

export class OrderModel {
  private paymentType: 'card' | 'cash' = 'card';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  setPayment(paymentType: 'card' | 'cash', address: string) {
    this.paymentType = paymentType;
    this.address = address;
  }

  setContacts(email: string, phone: string) {
    this.email = email;
    this.phone = phone;
  }

  /**
   * Возвращает финальный заказ для API
   */
  getOrder(items: CartItem[], total: number): OrderPayload {
    return {
      items: items.map(i => i.productId),
      payment: this.paymentType,
      address: this.address,
      email: this.email,
      phone: this.phone,
      total: total
    };
  }

  clear() {
    this.paymentType = 'card';
    this.address = '';
    this.email = '';
    this.phone = '';
  }
}
