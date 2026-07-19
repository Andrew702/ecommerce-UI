import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { ProductList } from '../product-list/product-list';

@Component({
  selector: 'app-shop-main-content',
  imports: [ProductList],
  templateUrl: './shop-main-content.html',
})
export class ShopMainContent implements OnInit {
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.GetCategories().subscribe({
      next: (cats) => this.productService.categories.set(cats),
    });
  }

  Search(e: Event) {
    const t = e.target as HTMLInputElement;
    this.productService.search.set(t.value);
  }

  change(categoryId: number | string) {
    const id = Number(categoryId);
    if (!id || isNaN(id)) {
      this.productService.GetAllProducts().subscribe({
        next: (data) => this.productService.products.set(data),
        error: (err) => console.error(err),
      });
    } else {
      this.productService.GetProductByCategory(id).subscribe({
        next: (data) => this.productService.products.set(data),
        error: (err) => console.error(err),
      });
    }
  }
}
