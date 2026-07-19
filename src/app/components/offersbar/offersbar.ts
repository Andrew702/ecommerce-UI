import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Shape of one offer item
export interface Offer {
  label: string;
  detail: string;
  imageUrl: string;
  code?: string;
}

@Component({
  selector: 'app-offersbar',
  imports: [RouterLink],
  templateUrl: './offersbar.html',
  styleUrl: './offersbar.css',
})
export class Offersbar {
  offers: Offer[] = [
    {
      label: '🔥 Flash Sale',
      detail: '30% off all dresses — today only',
      code: 'DRESS30',
      imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    },
    {
      label: '👟 Shoes & Bags',
      detail: 'Buy 2, get 1 free',
      code: 'BAGS2FOR1',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    },
    {
      label: '✨ Beauty',
      detail: 'Free skincare kit on orders over $60',
      code: 'GLOW60',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
    },
    {
      label: '🎁 New Members',
      detail: 'Extra 15% off your first order',
      code: 'WELCOME15',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    },
  ];
}
