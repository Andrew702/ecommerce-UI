import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { Product } from '../../Models/IProduct';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification-service';
import { WishlistService } from '../../services/wishlist-service';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-productdetails',
  imports: [],
  templateUrl: './productdetails.html',
})
export class Productdetails {
  wishlistService = inject(WishlistService);
  authService = inject(Authservice);
  notify = inject(NotificationService);
  productService = inject(ProductService);
  cartService = inject(CartService);

  product = signal<Product | null>(null);
  Quantity = signal<number>(1);

  router = inject(Router);
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.GetProductById(id).subscribe({
      next: (data) => this.product.set(data),
      error: (err) => console.error(err),
    });
  }

  addToWishlist(productId: number) {
    if (!this.authService.isLoggedIn()) return;
    if (this.isInWishlist(productId)) {
      this.wishlistService.RemoveFromWishlist(productId);
    } else {
      this.wishlistService.AddToWishlist(productId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.IsInWishlist(productId);
  }

  addQuantity() {
    this.Quantity.update((num) => num + 1);
  }

  reduceQuantity() {
    this.Quantity.update((num) => (num > 1 ? num - 1 : num));
  }

  addToCart(event: MouseEvent) {
    event.stopPropagation();
    const currentProduct = this.product();
    if (!currentProduct) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addToCart(currentProduct.id, this.Quantity());
    this.notify.success('Item Added to Cart', 2000);
  }
}
