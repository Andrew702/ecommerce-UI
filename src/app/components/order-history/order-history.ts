import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../../Models/IOrder';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-order-history',
  imports: [DatePipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  orderService = inject(OrderService);
  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.orderService.getUserOrders();
    this.orders = this.orderService.orders;
  }
}
