import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../Models/IOrder';
import { apiURL } from '../Models/api';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  orders = signal<Order[]>([]);

  createOrder() {
    return this.http.post<Order>(`${apiURL}/orders`, {});
  }

  getUserOrders() {
    this.http.get<Order[]>(`${apiURL}/orders`).subscribe({
      next: (orders) => this.orders.set(orders),
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  getOrderById(orderId: number) {
    return this.http.get<Order>(`${apiURL}/orders/${orderId}`);
  }
}
