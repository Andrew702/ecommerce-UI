export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  brandId: number;
  categoryName: string;
  brandName: string;
  averageRating: number;
  reviewCount: number;
  discountPercentage: number | null;
  isOnSale: boolean;
  stockQuantity: number;
  isInStock: boolean;
  reviews: Review[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}
