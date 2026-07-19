import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../Models/ICartItem';
import { AddToCartRequest, UpdateCartItemRequest } from '../Models/Auth';
import { apiURL } from '../Models/api';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

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
    this.http.get<CartItem[]>(`${apiURL}/cart`).subscribe({
      next: (items) => this.cartItems.set(items),
      error: (err) => console.error('Error loading cart:', err),
    });
  }

  addToCart(productId: number, quantity: number = 1) {
    const body: AddToCartRequest = { productId, quantity };
    this.http.post<CartItem>(`${apiURL}/cart/items`, body).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error adding to cart:', err),
    });
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(itemId);
      return;
    }
    this.http.put(`${apiURL}/cart/items/${itemId}`, { quantity } as UpdateCartItemRequest).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error updating cart:', err),
    });
  }

  removeFromCart(itemId: number) {
    this.http.delete(`${apiURL}/cart/items/${itemId}`).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error removing from cart:', err),
    });
  }

  clearCart() {
    this.http.delete(`${apiURL}/cart`).subscribe({
      next: () => this.cartItems.set([]),
      error: (err) => console.error('Error clearing cart:', err),
    });
  }
}
