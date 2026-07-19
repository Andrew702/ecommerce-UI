import { Component, inject, Input, signal } from '@angular/core';
import { Product } from '../../Models/IProduct';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { Authservice } from '../../services/authservice';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-productcard',
  imports: [],
  templateUrl: './productcard.html',
  styleUrl: './productcard.css',
})
export class Productcard {
  @Input() product!: Product;
  @Input() ShopVerseChoice: boolean = false;

  notify = inject(NotificationService);
  router = inject(Router);
  cartService = inject(CartService);
  authService = inject(Authservice);

  goToProduct() {
    this.router.navigate(['/main', 'shop', this.product.id]);
  }

  addToCart(event: MouseEvent) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addToCart(this.product.id, 1);
    this.notify.success('Item Added to Cart', 2000);
  }
}
