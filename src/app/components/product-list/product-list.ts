import { Component, inject } from '@angular/core';
import { Productcard } from '../productcard/productcard';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-list',
  imports: [Productcard],
  templateUrl: './product-list.html',
})
export class ProductList {
  productService = inject(ProductService);
}
