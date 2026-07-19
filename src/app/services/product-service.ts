import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../Models/IProduct';
import { PagedResponse, CategoryResponse, BrandResponse } from '../Models/ApiResponse';
import { apiURL } from '../Models/api';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  products = signal<Product[]>([]);
  categories = signal<CategoryResponse[]>([]);
  brands = signal<BrandResponse[]>([]);
  search = signal('');
  ShopVerseChoice = signal(false);

  filteredProducts = computed(() => {
    const query = this.search().toLowerCase();
    if (!query) return this.products();
    return this.products().filter(
      (prod) =>
        prod.title.toLowerCase().includes(query) ||
        prod.categoryName.toLowerCase().includes(query) ||
        prod.price.toString().includes(query),
    );
  });

  GetAllProducts() {
    return this.http.get<PagedResponse<Product>>(`${apiURL}/products?page=1&pageSize=50`).pipe(
      map((res) => res.items),
    );
  }

  GetShopVerseChoice() {
    return this.http.get<PagedResponse<Product>>(`${apiURL}/products?page=1&pageSize=50`).pipe(
      map((res) => res.items.filter((p) => p.averageRating > 4.5)),
    );
  }

  GetProductById(id: number) {
    return this.http.get<Product>(`${apiURL}/products/${id}`);
  }

  GetProductByCategory(categoryId: number) {
    return this.http.get<Product[]>(`${apiURL}/products/category/${categoryId}`);
  }

  GetProductByBrand(brandId: number) {
    return this.http.get<Product[]>(`${apiURL}/products/brand/${brandId}`);
  }

  SearchProducts(query: string) {
    return this.http.get<Product[]>(`${apiURL}/products/search?q=${query}`);
  }

  GetCategories() {
    return this.http.get<CategoryResponse[]>(`${apiURL}/products/categories`);
  }

  GetBrands() {
    return this.http.get<BrandResponse[]>(`${apiURL}/products/brands`);
  }
}
