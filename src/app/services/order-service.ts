import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../Models/IOrder';
import { apiURL } from '../Models/api';
import { NotificationService } from './notification-service';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  notify = inject(NotificationService);
  authService = inject(Authservice);
  orders = signal<Order[]>([]);

  createOrder() {
    return this.http.post<Order>(`${apiURL}/Order`, {});
  }

  getUserOrders() {
    this.http.get<Order[]>(`${apiURL}/Order`).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.authService.userOrders.set(orders);
      },
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to load orders'),
    });
  }

  getOrderById(orderId: number) {
    return this.http.get<Order>(`${apiURL}/Order/${orderId}`);
  }
}
