import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-home-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './home-layout.html',
})
export class HomeLayout implements OnInit {
  cartService = inject(CartService);
  authService = inject(Authservice);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }
}
