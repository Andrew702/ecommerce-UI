import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { apiURL } from '../Models/api';
import { Authservice } from './authservice';
import { WishlistResponse } from '../Models/Auth';
import { NotificationService } from './notification-service';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  http = inject(HttpClient);
  authService = inject(Authservice);
  notify = inject(NotificationService);

  WishlistItems = signal<number[]>([]);

  GetWishlist() {
    return this.http.get<WishlistResponse[]>(`${apiURL}/Wishlist`).pipe(
      map((items) => items.map((w) => w.productId)),
      tap({
        next: (ids) => {
          this.WishlistItems.set(ids);
          this.authService.wishlistIds.set(ids);
          localStorage.setItem('wishlist', JSON.stringify(ids));
        },
        error: (err) => this.notify.error(err?.error?.detail || 'Failed to load wishlist'),
      }),
    );
  }

  AddToWishlist(productId: number) {
    this.http.post(`${apiURL}/Wishlist/${productId}`, {}).subscribe({
      next: () => {
        const updated = [...this.WishlistItems(), productId];
        this.WishlistItems.set(updated);
        this.authService.wishlistIds.set(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      },
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to add to wishlist'),
    });
  }

  RemoveFromWishlist(productId: number) {
    this.http.delete(`${apiURL}/Wishlist/${productId}`).subscribe({
      next: () => {
        const updated = this.WishlistItems().filter((id) => id !== productId);
        this.WishlistItems.set(updated);
        this.authService.wishlistIds.set(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      },
      error: (err) => this.notify.error(err?.error?.detail || 'Failed to remove from wishlist'),
    });
  }

  IsInWishlist(productId: number): boolean {
    return this.WishlistItems().includes(productId);
  }
}
