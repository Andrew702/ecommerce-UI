import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { RouterLink } from '@angular/router';
import { Authservice } from '../../services/authservice';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header {
  authService = inject(Authservice);
  cartService = inject(CartService);
  notify = inject(NotificationService);

  logout() {
    this.authService.logout();
    this.notify.info('Logged Out', 3000);
  }
}
