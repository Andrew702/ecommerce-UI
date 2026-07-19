import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../services/stripe';
import { NotificationService } from '../../services/notification-service';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  authService = inject(Authservice);
  notify = inject(NotificationService);
  router = inject(Router);
  stripeService = inject(StripeService);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }

  updateQty(itemId: number, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  remove(itemId: number) {
    this.cartService.removeFromCart(itemId);
    this.notify.info('Removed item from cart', 2000);
  }

  checkout() {
    const cartForStripe = this.cartService.cartItems().map((item) => ({
      name: item.productTitle,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.productImage,
    }));

    this.stripeService.checkout(cartForStripe);
  }

  backToShop() {
    this.router.navigate(['/main/shop']);
  }
}
