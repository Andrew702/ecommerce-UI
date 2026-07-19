# ecommerce-app — Backend API Reference

This file documents the .NET backend so any AI session opened from this frontend project knows exactly how to call the API.

---

## Backend Connection

| Setting | Value |
|---------|-------|
| **Base URL** | `https://localhost:7186` |
| **API prefix** | `/api` |
| **Full API root** | `https://localhost:7186/api` |
| **Angular config** | `src/app/Models/api.ts` (`apiURL` constant) |
| **CORS** | AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader |

> **⚠️ CASE SENSITIVITY:** The .NET `[controller]` route token preserves PascalCase controller names.
> `Product` NOT `products`, `Cart` NOT `cart`, `Order` NOT `orders`, `Wishlist` NOT `wishlist`, `Auth` NOT `auth`.
> Using lowercase paths will return **404 Not Found**.

The backend is a **.NET 10 Web API** at `e:\ITI\Angular\Backend\ecommerce-API\ecommerceAPI\`. Start it with:
```powershell
dotnet run --project ecommerceAPI
```

---

## Authentication (JWT)

### Flow
1. **Register** → `POST /api/Auth/register` → returns `AuthResponse` with JWT `token`
2. **Login** → `POST /api/Auth/login` → returns `AuthResponse` with JWT `token`
3. **Store** → `localStorage.setItem('token', response.token)`
4. **Attach** → HTTP interceptor at `src/app/interceptors/auth.interceptor.ts` adds `Authorization: Bearer <token>` to all requests
5. **Logout** → `localStorage.removeItem('token')`, clear signals

### Auth Endpoints

#### POST `/api/Auth/register` (Anonymous)
**Request body:**
```json
{
  "userName": "string (required, 3-50 chars)",
  "email": "string (required, valid email)",
  "phone": "string (required)",
  "password": "string (required, min 6, 1 uppercase, 1 digit)"
}
```
**Response (200):** `AuthResponse`
```json
{
  "userId": "string",
  "userName": "string",
  "email": "string",
  "token": "string (JWT)",
  "expiresAt": "2026-07-20T...",
  "wishlist": [1, 5, 12],
  "cartItems": [{ "id": 1, "productId": 3, "productTitle": "...", "productImage": "...", "unitPrice": 29.99, "quantity": 2 }],
  "orders": [{ "id": 1, "total": 59.98, "date": "2026-07-19T...", "status": "Pending", "userId": "...", "orderItems": [...] }]
}
```

#### POST `/api/Auth/login` (Anonymous)
**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response (200):** `AuthResponse` (same shape as register)

---

## Products

### GET `/api/Product` (Anonymous, paginated)
**Query params:** `?page=1&pageSize=12&search=&categoryId=&brandId=&minPrice=&maxPrice=&minRating=&onSale=&inStock=&sortBy=`
**Response (200):** `PagedResponse<ProductResponse>`
```json
{
  "items": [
    {
      "id": 1,
      "title": "iPhone 15 Pro Max",
      "description": "Apple's flagship smartphone...",
      "price": 1199.99,
      "image": "https://picsum.photos/seed/iphone15/400/400",
      "categoryId": 1,
      "categoryName": "Electronics",
      "brandId": 1,
      "brandName": "Apple",
      "averageRating": 4.5,
      "reviewCount": 12,
      "discountPercentage": 10.00,
      "isOnSale": true,
      "stockQuantity": 25,
      "isInStock": true
    }
  ],
  "totalCount": 62,
  "page": 1,
  "pageSize": 12,
  "totalPages": 6,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

### GET `/api/Product/{id}` (Anonymous)
**Response (200):** `ProductDetailResponse` (same as ProductResponse + full `reviews` array)

### GET `/api/Product/category/{categoryId}` (Anonymous)
Returns `ProductResponse[]` filtered by category ID.

### GET `/api/Product/brand/{brandId}` (Anonymous)
Returns `ProductResponse[]` filtered by brand ID.

### GET `/api/Product/search?q={term}` (Anonymous)
Returns `ProductResponse[]` matching title or description.

### GET `/api/Product/categories` (Anonymous)
Returns `CategoryResponse[]`:
```json
[{ "id": 1, "name": "Electronics", "description": "Electronic devices and gadgets" }]
```

### GET `/api/Product/brands` (Anonymous)
Returns `BrandResponse[]`:
```json
[{ "id": 1, "name": "Apple", "logo": "apple.png" }]
```

---

## Cart (all require Authorization header)

### GET `/api/Cart`
Returns `CartItemResponse[]`:
```json
[
  {
    "id": 1,
    "productId": 3,
    "productTitle": "AirPods Pro 2",
    "productImage": "https://picsum.photos/seed/airpods/400/400",
    "unitPrice": 249.99,
    "quantity": 2
  }
]
```

### POST `/api/Cart/items`
**Request body:**
```json
{ "productId": 3, "quantity": 1 }
```
**Response (200):** `CartItemResponse` (single item). If product already in cart, quantity is incremented.

### PUT `/api/Cart/items/{cartItemId}`
**Request body:** `{ "quantity": 5 }`
**Response:** 204 No Content

### DELETE `/api/Cart/items/{cartItemId}`
**Response:** 204 No Content

### DELETE `/api/Cart`
Clears entire cart. **Response:** 204 No Content

---

## Orders (all require Authorization header)

### POST `/api/Order`
Creates order from current cart. Cart is cleared. Price is snapshotted.
**Response (200):** `OrderResponse`
```json
{
  "id": 1,
  "total": 499.98,
  "date": "2026-07-19T16:00:00Z",
  "status": "Pending",
  "userId": "abc123",
  "orderItems": [
    {
      "id": 1,
      "quantity": 2,
      "unitPrice": 249.99,
      "productId": 3,
      "productTitle": "AirPods Pro 2",
      "productImage": "https://picsum.photos/seed/airpods/400/400"
    }
  ]
}
```

### GET `/api/Order`
Returns `OrderResponse[]` for the current user, newest first.

### GET `/api/Order/{orderId}`
Returns single `OrderResponse`.

---

## Wishlist (all require Authorization header)

### GET `/api/Wishlist`
Returns `WishlistResponse[]`:
```json
[
  {
    "id": 1,
    "productId": 5,
    "productTitle": "Samsung 65\" OLED TV",
    "productPrice": 1799.99,
    "productImage": "https://picsum.photos/seed/samsungtv/400/400"
  }
]
```

### POST `/api/Wishlist/{productId}`
Idempotent — if already in wishlist, does nothing. **Response:** `{"message": "Added to wishlist."}`

### DELETE `/api/Wishlist/{productId}`
**Response:** 204 No Content

---

## Error Responses

All errors return ProblemDetails JSON:
```json
{
  "type": "https://httpstatuses.com/404",
  "title": "NotFound",
  "status": 404,
  "detail": "Product with ID 99 not found.",
  "traceId": "0HN..."
}
```
Common status codes: 400 (BadRequestException), 401 (UnauthorizedException), 404 (NotFoundException), 500 (unhandled).

---

## TypeScript Interfaces (matching backend DTOs)

```typescript
// --- Auth ---
interface LoginRequest { email: string; password: string; }
interface RegisterRequest { userName: string; email: string; phone: string; password: string; }
interface AuthResponse {
  userId: string; userName: string; email: string; token: string; expiresAt: string;
  wishlist: number[]; cartItems: CartItem[]; orders: Order[];
}

// --- Products ---
interface Product {
  id: number; title: string; description: string; price: number; image: string;
  categoryId: number; brandId: number; categoryName: string; brandName: string;
  averageRating: number; reviewCount: number;
  discountPercentage: number | null; isOnSale: boolean;
  stockQuantity: number; isInStock: boolean;
  reviews: Review[];
}
interface Review { rating: number; comment: string; date: string; reviewerName: string; }
interface CategoryResponse { id: number; name: string; description?: string; }
interface BrandResponse { id: number; name: string; logo?: string; }
interface PagedResponse<T> {
  items: T[]; totalCount: number; page: number; pageSize: number;
  totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean;
}

// --- Cart ---
interface CartItem {
  id: number; productId: number; productTitle: string; productImage: string;
  unitPrice: number; quantity: number;
}
interface AddToCartRequest { productId: number; quantity: number; }
interface UpdateCartItemRequest { quantity: number; }

// --- Orders ---
interface Order {
  id: number; total: number; date: string; status: string; userId: string;
  orderItems: OrderItem[];
}
interface OrderItem {
  id: number; productId: number; productTitle: string; productImage: string;
  quantity: number; unitPrice: number;
}

// --- Wishlist ---
interface WishlistResponse {
  id: number; productId: number; productTitle: string;
  productPrice: number; productImage: string;
}
```

---

## Angular Service → Endpoint Mapping

| Angular Service | File | Endpoints Called |
|----------------|------|-----------------|
| `Authservice` | `services/authservice.ts` | `POST /api/Auth/register`, `POST /api/Auth/login` |
| `ProductService` | `services/product-service.ts` | `GET /api/Product*`, `GET /api/Product/categories`, `GET /api/Product/brands` |
| `CartService` | `services/cart-service.ts` | `GET/POST /api/Cart`, `PUT/DELETE /api/Cart/items/{id}` |
| `OrderService` | `services/order-service.ts` | `POST/GET /api/Order`, `GET /api/Order/{id}` |
| `WishlistService` | `services/wishlist-service.ts` | `GET/POST/DELETE /api/Wishlist` |

---

## Common Patterns

### Adding auth to requests
The `auth.interceptor.ts` automatically attaches `Authorization: Bearer <token>` to every request. To manually get the token:
```typescript
const token = localStorage.getItem('token');
```

### Getting current user ID
The JWT contains `nameidentifier` claim. In a controller component:
```typescript
// The backend extracts userId from the JWT — no need to pass it in request body/params
// Components just call services without passing userId
this.cartService.addToCart(productId, quantity);
```

### Pagination
```typescript
this.http.get<PagedResponse<Product>>(`${apiURL}/products?page=1&pageSize=12`);
// Response: { items: [...], totalCount: 62, page: 1, pageSize: 12, totalPages: 6, ... }
```

### Error handling
Services should handle errors per-call. The backend returns ProblemDetails JSON. Use the `detail` field for user-facing messages:
```typescript
error: (err) => {
  const msg = err?.error?.detail || 'Something went wrong';
  this.notify.error(msg);
}
```

---

## Demo Credentials (seeded on first run)

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@ecommerce.com | Admin@123 | Admin |
| john_doe | john@test.com | P@ssw0rd1 | Customer |
| jane_smith | jane@test.com | P@ssw0rd2 | Customer |
| bob_wilson | bob@test.com | P@ssw0rd3 | Customer |
| alice_brown | alice@test.com | P@ssw0rd4 | Customer |
| mike_davis | mike@test.com | P@ssw0rd5 | Customer |
