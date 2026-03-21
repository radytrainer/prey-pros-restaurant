export type UserRole = 'admin' | 'staff' | 'customer';

export type TimeCategory = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type PaymentMethod = 'Cash' | 'KHQR';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
}

export interface MenuItemIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  timeCategory?: TimeCategory;
  imageUrl?: string;
  ingredients: MenuItemIngredient[];
  isAvailable: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  stockLevel: number;
  unit: string;
  minStockLevel: number;
  supplier: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  tableNumber: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export interface Table {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
  qrCodeUrl?: string;
}

export interface Sale {
  id: string;
  orderId: string;
  amount: number;
  createdAt: string;
}
