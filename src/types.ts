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

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  tableNumber: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
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

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          show: () => void;
          hide: () => void;
          isActive: boolean;
          isVisible: boolean;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          enable: () => void;
          disable: () => void;
          setText: (text: string) => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
      };
    };
  }
}

