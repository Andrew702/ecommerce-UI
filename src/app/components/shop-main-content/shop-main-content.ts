import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ProductList } from '../product-list/product-list';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-shop-main-content',
  imports: [ProductList],
  templateUrl: './shop-main-content.html',
})
export class ShopMainContent implements OnInit {
  productService = inject(ProductService);
  notify = inject(NotificationService);

  ngOnInit() {
    // Load categories for sidebar filter
    this.productService.GetCategories().subscribe({
      next: (cats) => this.productService.categories.set(cats),
      error: (err) =>
        this.notify.error(err?.error?.detail || 'Failed to load categories'),
    });

    // Load brands for sidebar filter
    this.productService.GetBrands().subscribe({
      next: (brands) => this.productService.brands.set(brands),
      error: (err) =>
        this.notify.error(err?.error?.detail || 'Failed to load brands'),
    });

    // Load all products on shop entry (only if not already loaded)
    if (this.productService.products().length === 0) {
      this.productService.GetAllProducts().subscribe({
        next: (data) => this.productService.products.set(data),
        error: (err) =>
          this.notify.error(err?.error?.detail || 'Failed to load products'),
      });
    }
  }

  Search(e: Event) {
    const t = e.target as HTMLInputElement;
    this.productService.search.set(t.value);
  }
}
