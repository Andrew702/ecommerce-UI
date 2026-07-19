import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { WishlistService } from '../../services/wishlist-service';
import { Authservice } from '../../services/authservice';
import { NotificationService } from '../../services/notification-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  wishlistService = inject(WishlistService);
  authService = inject(Authservice);
  productService = inject(ProductService);
  notify = inject(NotificationService);

  // ─── Quick Links ────────────────────────────────

  toggleShopVerseChoice() {
    if (this.productService.ShopVerseChoice()) {
      // Turn off — reset to all items
      this.productService.ShopVerseChoice.set(false);
      this.productService.setMinRating(null);
    } else {
      // Turn on — show high-rated picks
      this.productService.clearFilters();
      this.productService.ShopVerseChoice.set(true);
      this.productService.setMinRating(4.5);
    }
  }

  toggleWishlist() {
    if (!this.authService.isLoggedIn()) {
      this.notify.info('Please log in to view your wishlist.');
      return;
    }

    if (this.productService.showWishlistOnly()) {
      // Turn off wishlist-only mode
      this.productService.showWishlistOnly.set(false);
    } else {
      // Turn on — load wishlist IDs first, then toggle
      this.wishlistService.GetWishlist().subscribe({
        next: () => {
          this.productService.clearFilters();
          this.productService.showWishlistOnly.set(true);
        },
        error: (err) =>
          this.notify.error(err?.error?.detail || 'Failed to load wishlist'),
      });
    }
  }

  clearFilters() {
    this.productService.clearFilters();
  }

  // ─── Category ────────────────────────────────────

  onCategoryChange(id: number | null) {
    this.productService.setCategory(id);
  }

  // ─── Price Range ─────────────────────────────────

  onPriceMinChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const val = input.value ? Number(input.value) : null;
    this.productService.priceMin.set(val);
  }

  onPriceMaxChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const val = input.value ? Number(input.value) : null;
    this.productService.priceMax.set(val);
  }

  setPriceQuick(min: number, max: number | null) {
    this.productService.setPriceRange(min, max);
  }

  // ─── Brand ───────────────────────────────────────

  toggleBrand(id: number) {
    this.productService.toggleBrand(id);
  }

  // ─── Rating ──────────────────────────────────────

  onRatingChange(rating: number | null) {
    this.productService.setMinRating(rating);
  }

  // ─── Sort ────────────────────────────────────────

  onSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.productService.setSort(select.value);
  }
}
