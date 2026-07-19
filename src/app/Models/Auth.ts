import { CartItem } from './ICartItem';
import { Order } from './IOrder';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  userName: string;
  email: string;
  token: string;
  expiresAt: string;
  wishlist: number[];
  cartItems: CartItem[];
  orders: Order[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface WishlistResponse {
  id: number;
  productId: number;
  productTitle: string;
  productPrice: number;
  productImage: string;
}
