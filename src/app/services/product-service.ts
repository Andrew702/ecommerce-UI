import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../Models/IProduct';
import { PagedResponse, CategoryResponse, BrandResponse } from '../Models/ApiResponse';
import { apiURL } from '../Models/api';
import { map, of } from 'rxjs';
import { WishlistService } from './wishlist-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  wishlistService = inject(WishlistService);

  // ─── Data ────────────────────────────────────────
  products = signal<Product[]>([]);
  categories = signal<CategoryResponse[]>([]);
  brands = signal<BrandResponse[]>([]);

  // ─── Filter state ────────────────────────────────
  search = signal('');
  selectedCategoryId = signal<number | null>(null);
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  minRating = signal<number | null>(null);
  selectedBrandIds = signal<number[]>([]);
  showDealsOnly = signal(false);
  showWishlistOnly = signal(false);
  sortBy = signal<string>('default');
  ShopVerseChoice = signal(false);

  // ─── Multi-filter computed pipeline ──────────────
  filteredProducts = computed(() => {
    let result = this.products();

    // 1. Category filter
    const catId = this.selectedCategoryId();
    if (catId !== null) {
      result = result.filter((p) => p.categoryId === catId);
    }

    // 2. Price range filter
    const pMin = this.priceMin();
    if (pMin !== null) {
      result = result.filter((p) => p.price >= pMin);
    }
    const pMax = this.priceMax();
    if (pMax !== null) {
      result = result.filter((p) => p.price <= pMax);
    }

    // 3. Rating filter
    const rating = this.minRating();
    if (rating !== null) {
      result = result.filter((p) => p.averageRating >= rating);
    }

    // 4. Brand filter
    const brandIds = this.selectedBrandIds();
    if (brandIds.length > 0) {
      console.log('[filteredProducts] filtering by brands:', brandIds, 'brandId types:', brandIds.map(b => typeof b));
      const before = result.length;
      result = result.filter((p) => brandIds.some((bid) => Number(bid) === Number(p.brandId)));
      console.log('[filteredProducts] brand filter:', before, '->', result.length);
    }

    // 5. Deals toggle (highly rated + well reviewed)
    if (this.showDealsOnly()) {
      result = result.filter((p) => p.averageRating >= 4 && p.reviewCount >= 10);
    }

    // 6. Wishlist toggle
    if (this.showWishlistOnly()) {
      const ids = this.wishlistService.WishlistItems();
      if (ids.length > 0) {
        result = result.filter((p) => ids.includes(p.id));
      }
    }

    // 7. Search filter (text search across title, category, brand, price)
    const query = this.search().toLowerCase();
    if (query) {
      result = result.filter(
        (prod) =>
          prod.title.toLowerCase().includes(query) ||
          prod.categoryName.toLowerCase().includes(query) ||
          prod.brandName.toLowerCase().includes(query) ||
          prod.price.toString().includes(query),
      );
    }

    // 8. Sort
    const sort = this.sortBy();
    if (sort !== 'default') {
      result = [...result]; // break signal reference for mutable sort
      switch (sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'name-asc':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }

    return result;
  });

  // ─── Derived counts ──────────────────────────────
  dealsCount = computed(
    () =>
      this.products().filter((p) => p.averageRating >= 4 && p.reviewCount >= 10)
        .length,
  );

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedCategoryId() !== null) count++;
    if (this.priceMin() !== null || this.priceMax() !== null) count++;
    if (this.minRating() !== null) count++;
    if (this.selectedBrandIds().length > 0) count++;
    if (this.showDealsOnly()) count++;
    if (this.showWishlistOnly()) count++;
    if (this.search()) count++;
    return count;
  });

  // ─── API methods ─────────────────────────────────
  GetAllProducts() {
    return this.http
      .get<PagedResponse<Product>>(`${apiURL}/Product?page=1&pageSize=200`)
      .pipe(map((res) => {
        console.log('[GetAllProducts] loaded', res.items.length, 'products');
        if (res.items.length > 0) {
          const sample = res.items[0];
          console.log('[GetAllProducts] first product keys:', Object.keys(sample));
          console.log('[GetAllProducts] first product brandId=', sample.brandId, 'type=', typeof sample.brandId);
        }
        return res.items;
      }));
  }

  GetShopVerseChoice() {
    // Reuse existing products if already loaded to avoid redundant API call
    const existing = this.products();
    if (existing.length > 0) {
      return of(existing.filter((p) => p.averageRating > 4.5));
    }
    return this.http
      .get<PagedResponse<Product>>(`${apiURL}/Product?page=1&pageSize=200`)
      .pipe(map((res) => res.items.filter((p) => p.averageRating > 4.5)));
  }

  GetProductById(id: number) {
    return this.http.get<Product>(`${apiURL}/Product/${id}`);
  }

  GetProductByCategory(categoryId: number) {
    return this.http.get<Product[]>(`${apiURL}/Product/category/${categoryId}`);
  }

  GetProductByBrand(brandId: number) {
    return this.http.get<Product[]>(`${apiURL}/Product/brand/${brandId}`);
  }

  SearchProducts(query: string) {
    return this.http.get<Product[]>(`${apiURL}/Product/search?q=${query}`);
  }

  GetCategories() {
    return this.http.get<CategoryResponse[]>(`${apiURL}/Product/categories`);
  }

  GetBrands() {
    return this.http.get<BrandResponse[]>(`${apiURL}/Product/brands`).pipe(
      map((brands) => {
        console.log('[GetBrands] loaded', brands.length, 'brands');
        if (brands.length > 0) {
          console.log('[GetBrands] first brand:', brands[0], 'id type=', typeof brands[0].id);
        }
        return brands;
      })
    );
  }

  // ─── Filter helpers ──────────────────────────────
  clearFilters() {
    this.search.set('');
    this.selectedCategoryId.set(null);
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.minRating.set(null);
    this.selectedBrandIds.set([]);
    this.showDealsOnly.set(false);
    this.showWishlistOnly.set(false);
    this.sortBy.set('default');
    this.ShopVerseChoice.set(false);
  }

  setCategory(id: number | null) {
    this.selectedCategoryId.set(id);
    this.ShopVerseChoice.set(false);
  }

  setMinRating(rating: number | null) {
    this.minRating.set(rating);
  }

  toggleBrand(id: number) {
    // Ensure numeric comparison (API may return strings in some configurations)
    const numId = Number(id);
    const current = this.selectedBrandIds();
    console.log('[toggleBrand] id=', numId, 'type=', typeof numId, 'current=', current);
    if (current.includes(numId)) {
      const next = current.filter((b) => b !== numId);
      console.log('[toggleBrand] removing ->', next);
      this.selectedBrandIds.set(next);
    } else {
      const next = [...current, numId];
      console.log('[toggleBrand] adding ->', next);
      this.selectedBrandIds.set(next);
    }
    // Debug: check a few products' brandId types
    const prods = this.products();
    if (prods.length > 0) {
      console.log('[toggleBrand] sample product brandIds:',
        prods.slice(0, 3).map(p => ({ id: p.id, brandId: p.brandId, type: typeof p.brandId })));
    }
  }

  isBrandSelected(brandId: number): boolean {
    return this.selectedBrandIds().some((id) => Number(id) === Number(brandId));
  }

  setPriceRange(min: number | null, max: number | null) {
    this.priceMin.set(min);
    this.priceMax.set(max);
  }

  setSort(key: string) {
    this.sortBy.set(key);
  }
}
