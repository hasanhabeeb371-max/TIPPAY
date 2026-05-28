export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  distance: string;
  deliveryTime: string;
  isOpen: boolean;
  menu: MenuItem[];
  lat?: number;
  lng?: number;
}

export type OrderStatus =
  | "Ordered"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Picked Up"
  | "Delivered";

export interface Order {
  id: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  discount?: number;
  status: OrderStatus;
  date: string;
  time: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface HotDeal {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  restaurantName: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrderValue: number;
  isActive: boolean;
  validUntil: string;
}

export interface AdminRestaurant {
  id: string;
  name: string;
  image: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  gstin: string;
  category: string;
  status: "pending" | "approved" | "suspended";
  appliedDate: string;
  lat?: number;
  lng?: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  restaurantName: string;
  deliveryAgent: string | null;
  items: { name: string; quantity: number }[];
  totalPrice: number;
  status: string;
  date: string;
  time: string;
}

export interface AdminAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  completedDeliveries: number;
  rating: number;
  status: "active" | "inactive";
  joinedDate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  joinedDate: string;
}

export interface RestaurantMenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface RestaurantOrder extends Order {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
}

export interface DeliveryOrder {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: OrderStatus;
  distance: string;
  estimatedTime: string;
  date: string;
  time: string;
}

export interface AgentStats {
  totalDeliveries: number;
  todayDeliveries: number;
  avgRating: number;
  earnings: { today: number; week: number; month: number };
}
