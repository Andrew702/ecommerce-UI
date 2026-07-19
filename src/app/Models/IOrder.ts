export interface Order {
  id: number;
  total: number;
  date: string;
  status: string;
  userId: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
}
