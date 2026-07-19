import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { apiURL } from '../Models/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../Models/Auth';
import { AppUser } from '../Models/User';
import { CartItem } from '../Models/ICartItem';
import { Order } from '../Models/IOrder';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  http = inject(HttpClient);

  currentUser = signal<AppUser | null>(null);
  wishlistIds = signal<number[]>([]);
  cartItems = signal<CartItem[]>([]);
  userOrders = signal<Order[]>([]);

  isLoggedIn = computed(() => !!this.currentUser() && !!localStorage.getItem('token'));

  constructor() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken && storedToken !== 'fake-token') {
      this.currentUser.set(JSON.parse(storedUser));
      // Load wishlist IDs if saved
      const wishlist = localStorage.getItem('wishlist');
      if (wishlist) this.wishlistIds.set(JSON.parse(wishlist));
    }
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${apiURL}/Auth/register`, request);
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${apiURL}/Auth/login`, credentials);
  }

  handleAuthResponse(response: AuthResponse) {
    localStorage.setItem('token', response.token);

    const user: AppUser = {
      userId: response.userId,
      userName: response.userName,
      email: response.email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);

    // Store wishlist IDs
    if (response.wishlist) {
      localStorage.setItem('wishlist', JSON.stringify(response.wishlist));
      this.wishlistIds.set(response.wishlist);
    }

    // Store cart items
    if (response.cartItems) {
      this.cartItems.set(response.cartItems);
    }

    // Store orders
    if (response.orders) {
      this.userOrders.set(response.orders);
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('wishlist');
    this.currentUser.set(null);
    this.wishlistIds.set([]);
    this.cartItems.set([]);
    this.userOrders.set([]);
  }
}
