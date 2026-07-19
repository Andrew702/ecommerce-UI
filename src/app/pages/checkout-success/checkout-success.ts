import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess {
  orderService = inject(OrderService);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.orderService.createOrder().subscribe({
      next: () => {
        localStorage.removeItem('Cart');
        localStorage.removeItem('Total');
        this.cartService.clearCart();
      },
      error: (err) => console.error('Error creating order:', err),
    });
  }
}
