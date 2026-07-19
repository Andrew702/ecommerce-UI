import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { apiURL } from '../Models/api';
import { Authservice } from './authservice';
import { WishlistResponse } from '../Models/Auth';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  http = inject(HttpClient);
  authService = inject(Authservice);

  WishlistItems = signal<number[]>([]);

  GetWishlist() {
    this.http.get<WishlistResponse[]>(`${apiURL}/wishlist`).subscribe({
      next: (items) => {
        const ids = items.map((w) => w.productId);
        this.WishlistItems.set(ids);
        this.authService.wishlistIds.set(ids);
        localStorage.setItem('wishlist', JSON.stringify(ids));
      },
      error: (err) => console.error('Error loading wishlist:', err),
    });
  }

  AddToWishlist(productId: number) {
    this.http.post(`${apiURL}/wishlist/${productId}`, {}).subscribe({
      next: () => {
        const updated = [...this.WishlistItems(), productId];
        this.WishlistItems.set(updated);
        this.authService.wishlistIds.set(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      },
      error: (err) => console.error('Error adding to wishlist:', err),
    });
  }

  RemoveFromWishlist(productId: number) {
    this.http.delete(`${apiURL}/wishlist/${productId}`).subscribe({
      next: () => {
        const updated = this.WishlistItems().filter((id) => id !== productId);
        this.WishlistItems.set(updated);
        this.authService.wishlistIds.set(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      },
      error: (err) => console.error('Error removing from wishlist:', err),
    });
  }

  IsInWishlist(productId: number): boolean {
    return this.WishlistItems().includes(productId);
  }
}
