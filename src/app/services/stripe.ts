import { Injectable } from '@angular/core';
//import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  checkout(cart: any[]) {

  // save cart and total for order
  localStorage.setItem('Cart', JSON.stringify(cart));
  localStorage.setItem('Total', JSON.stringify(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  ));


  return fetch('http://localhost:4242/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart })
  })
  .then(res => res.json())
  .then(data => {
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('No checkout URL returned');
    }
  });
}
}