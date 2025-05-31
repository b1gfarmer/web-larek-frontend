export interface Order {
  items: string[];
  payment: string;
  address: string;
  email: string;
  phone: string;
}


export interface OrderResponse {
  id: string;
  total: number;
}
