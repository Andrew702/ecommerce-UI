import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Category {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-categoriesgrid',
  imports: [RouterLink],
  templateUrl: './categoriesgrid.html',
  styleUrl: './categoriesgrid.css',
})
export class Categoriesgrid {
  categories: Category[] = [
    {
      title: 'Clothes',
      subtitle: 'New season arrivals',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
      link: '/shop/clothes',
    },
    {
      title: 'Accessories',
      subtitle: 'Complete your look',
      imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
      link: '/shop/accessories',
    },
    {
      title: 'Shoes & Bags',
      subtitle: 'Step up your style',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      link: '/shop/shoes-bags',
    },
    {
      title: 'Beauty & Skincare',
      subtitle: 'Glow from within',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
      link: '/shop/beauty',
    },
  ];
}
