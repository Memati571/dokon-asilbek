
export type UserRole = 'customer' | 'restaurant_owner' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  deliveryTime: string;
  deliveryFee: number;
  address: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  type: OrderType;
  createdAt: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
