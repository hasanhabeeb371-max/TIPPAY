import type { OrderStatus } from "@/data/mockData";

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

export const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: "TP-20260309-3001",
    restaurantName: "Burger Palace",
    restaurantAddress: "12, Brigade Road, Bangalore",
    customerName: "Rahul Sharma",
    customerPhone: "+91 9876543210",
    deliveryAddress: "42, MG Road, Bangalore",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 199 },
      { name: "French Fries", quantity: 1, price: 99 },
    ],
    totalPrice: 497,
    status: "Ready",
    distance: "1.2 km",
    estimatedTime: "12 min",
    date: "2026-03-09",
    time: "1:30 PM",
  },
  {
    id: "TP-20260309-3002",
    restaurantName: "Pizza Hub",
    restaurantAddress: "5, Koramangala 5th Block, Bangalore",
    customerName: "Priya Patel",
    customerPhone: "+91 9123456789",
    deliveryAddress: "15, Indiranagar, Bangalore",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 249 },
      { name: "Garlic Bread", quantity: 1, price: 129 },
    ],
    totalPrice: 378,
    status: "Ready",
    distance: "2.8 km",
    estimatedTime: "18 min",
    date: "2026-03-09",
    time: "1:15 PM",
  },
  {
    id: "TP-20260309-3003",
    restaurantName: "Spice Garden",
    restaurantAddress: "8, Jayanagar 4th Block, Bangalore",
    customerName: "Amit Kumar",
    customerPhone: "+91 9988776655",
    deliveryAddress: "7, BTM Layout, Bangalore",
    items: [
      { name: "Hyderabadi Biryani", quantity: 1, price: 299 },
    ],
    totalPrice: 299,
    status: "Preparing",
    distance: "3.5 km",
    estimatedTime: "22 min",
    date: "2026-03-09",
    time: "12:50 PM",
  },
  {
    id: "TP-20260309-3004",
    restaurantName: "Dragon Wok",
    restaurantAddress: "19, Residency Road, Bangalore",
    customerName: "Sneha Reddy",
    customerPhone: "+91 9112233445",
    deliveryAddress: "22, Whitefield, Bangalore",
    items: [
      { name: "Hakka Noodles", quantity: 2, price: 169 },
      { name: "Spring Rolls", quantity: 1, price: 149 },
    ],
    totalPrice: 487,
    status: "Ready",
    distance: "4.2 km",
    estimatedTime: "25 min",
    date: "2026-03-09",
    time: "12:40 PM",
  },
  {
    id: "TP-20260308-3005",
    restaurantName: "Dosa Corner",
    restaurantAddress: "3, Malleshwaram, Bangalore",
    customerName: "Vikram Singh",
    customerPhone: "+91 9556677889",
    deliveryAddress: "5, Rajajinagar, Bangalore",
    items: [
      { name: "Masala Dosa", quantity: 3, price: 119 },
      { name: "Filter Coffee", quantity: 3, price: 49 },
    ],
    totalPrice: 504,
    status: "Delivered",
    distance: "1.5 km",
    estimatedTime: "-",
    date: "2026-03-08",
    time: "8:00 PM",
  },
  {
    id: "TP-20260308-3006",
    restaurantName: "Burger Palace",
    restaurantAddress: "12, Brigade Road, Bangalore",
    customerName: "Kavya Nair",
    customerPhone: "+91 9334455667",
    deliveryAddress: "11, JP Nagar, Bangalore",
    items: [
      { name: "Veggie Burger", quantity: 2, price: 199 },
    ],
    totalPrice: 398,
    status: "Delivered",
    distance: "2.1 km",
    estimatedTime: "-",
    date: "2026-03-08",
    time: "7:15 PM",
  },
];

export const agentStats = {
  totalDeliveries: 142,
  todayDeliveries: 5,
  avgRating: 4.7,
  earnings: { today: 850, week: 5200, month: 21500 },
};
