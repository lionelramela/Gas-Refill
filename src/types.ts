export interface CylinderProduct {
  id: string;
  size: string; // e.g. "5kg", "9kg", "14kg", "19kg", "48kg"
  sizeNum: number; // e.g., 5, 9, 14, 19, 48
  refillPrice: number; // Price of gas if customer returns an empty (Exchange)
  newPrice: number;    // Price of gas + new cylinder deposit (No Exchange)
  depositPrice: number; // Deposit price standalone
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  bestFor: string;
  dimensions: string; // e.g. "320mm x 250mm"
  weightEmpty: string; // e.g. "5.5kg Empty"
  gasType: string; // LPG
  color: string; // color string for 3D representation render (e.g. Hex or ThreeJS color)
}

export interface CartItem {
  product: CylinderProduct;
  quantity: number;
  type: 'exchange' | 'new'; // 'exchange' = only refill (R145), 'new' = refill + deposit (R145+R350)
}

export interface ServiceArea {
  name: string;
  deliveryFee: number;
  description: string;
  deliveryTime: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatarLetter: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}
