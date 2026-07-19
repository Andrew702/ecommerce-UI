import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../Models/ICartItem';
import { AddToCartRequest, UpdateCartItemRequest } from '../Models/Auth';
import { apiURL } from '../Models/api';
import { NotificationService } from './notification-service';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);
  notify = inject(NotificationService);
  authService = inject(Authservice);

  cartItems = signal<CartItem[]>([]);

  getItemCount(): number {
    let total = 0;
    for (let item of this.cartItems()) {
      total += item.quantity;
    }
    return total;
  }

  getSubtotal(): number {
    let sum = 0;
    for (let item of this.cartItems()) {
      sum += item.unitPrice * item.quantity;
    }
    return Math.round(sum * 100) / 100;
  }

  shipping: number = 10;

  getTotal(): number {
    return Math.round((this.getSubtotal() + this.shipping) * 100) / 100;
  }

  loadCart() {
    this.http.get<CartItem[]>(`${apiURL}/Cart`).subscribe({
      next: (items) => {
        this.cartItems.set(items);
        this.authService.cartItems.set(items);
      },
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to load cart'),
    });
  }

  addToCart(productId: number, quantity: number = 1) {
    const body: AddToCartRequest = { productId, quantity };
    this.http.post<CartItem>(`${apiURL}/Cart/items`, body).subscribe({
      next: () => this.loadCart(),
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to add item to cart'),
    });
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(itemId);
      return;
    }
    this.http.put(`${apiURL}/Cart/items/${itemId}`, { quantity } as UpdateCartItemRequest).subscribe({
      next: () => this.loadCart(),
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to update cart'),
    });
  }

  removeFromCart(itemId: number) {
    this.http.delete(`${apiURL}/Cart/items/${itemId}`).subscribe({
      next: () => this.loadCart(),
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to remove item from cart'),
    });
  }

  clearCart() {
    this.http.delete(`${apiURL}/Cart`).subscribe({
      next: () => {
        this.cartItems.set([]);
        this.authService.cartItems.set([]);
      },
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to clear cart'),
    });
  }
}
