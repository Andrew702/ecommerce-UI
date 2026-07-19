import { Component, inject } from '@angular/core';
import { Productcard } from '../productcard/productcard';
import { Product } from '../../Models/IProduct';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-list',
  imports: [Productcard],
  templateUrl: './product-list.html',
})
export class ProductList {
  productService = inject(ProductService);

  ngOnInit() {
    this.productService.GetAllProducts().subscribe({
      next: (data) => {
        this.productService.products.set(data);
        console.log(this.productService.products());
      },
      error: (err) => console.error(err),
    });
  }
}
