import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { WishlistService } from '../../services/wishlist-service';
import { Authservice } from '../../services/authservice';
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

  getWishlist() {
    if (this.authService.isLoggedIn()) {
      this.wishlistService.GetWishlist();
    }
  }

  getShopVerseChoices() {
    this.productService.ShopVerseChoice.set(true);
    this.productService.GetShopVerseChoice().subscribe({
      next: (data) => this.productService.products.set(data),
    });
  }

  AllItems() {
    this.productService.ShopVerseChoice.set(false);
    this.productService.GetAllProducts().subscribe({
      next: (data) => this.productService.products.set(data),
    });
  }

  ngOnInit() {
    this.AllItems();
  }
}
