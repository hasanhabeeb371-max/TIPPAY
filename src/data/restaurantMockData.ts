import { useState } from "react";
import type { Order, OrderStatus } from "@/data/mockData";

export interface RestaurantMenuItem {
  id: string;
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

// Mock restaurant orders
export const mockRestaurantOrders: RestaurantOrder[] = [
  {
    id: "TP-20260309-2001",
    restaurantName: "Burger Palace",
    customerName: "Rahul Sharma",
    customerPhone: "+91 9876543210",
    deliveryAddress: "42, MG Road, Bangalore",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 199 },
      { name: "French Fries", quantity: 1, price: 99 },
    ],
    totalPrice: 497,
    status: "Ordered",
    date: "2026-03-09",
    time: "1:30 PM",
  },
  {
    id: "TP-20260309-2002",
    restaurantName: "Burger Palace",
    customerName: "Priya Patel",
    customerPhone: "+91 9123456789",
    deliveryAddress: "15, Indiranagar, Bangalore",
    items: [
      { name: "Double Stack Burger", quantity: 1, price: 399 },
      { name: "Chocolate Shake", quantity: 2, price: 149 },
    ],
    totalPrice: 697,
    status: "Accepted",
    date: "2026-03-09",
    time: "1:15 PM",
  },
  {
    id: "TP-20260309-2003",
    restaurantName: "Burger Palace",
    customerName: "Amit Kumar",
    customerPhone: "+91 9988776655",
    deliveryAddress: "7, Koramangala, Bangalore",
    items: [
      { name: "Veggie Burger", quantity: 3, price: 199 },
    ],
    totalPrice: 597,
    status: "Preparing",
    date: "2026-03-09",
    time: "12:45 PM",
  },
  {
    id: "TP-20260309-2004",
    restaurantName: "Burger Palace",
    customerName: "Sneha Reddy",
    customerPhone: "+91 9112233445",
    deliveryAddress: "22, Whitefield, Bangalore",
    items: [
      { name: "Classic Cheeseburger", quantity: 1, price: 199 },
      { name: "French Fries", quantity: 2, price: 99 },
    ],
    totalPrice: 397,
    status: "Ready",
    date: "2026-03-09",
    time: "12:30 PM",
  },
  {
    id: "TP-20260308-2005",
    restaurantName: "Burger Palace",
    customerName: "Vikram Singh",
    customerPhone: "+91 9556677889",
    deliveryAddress: "5, HSR Layout, Bangalore",
    items: [
      { name: "Double Stack Burger", quantity: 2, price: 399 },
    ],
    totalPrice: 798,
    status: "Delivered",
    date: "2026-03-08",
    time: "8:00 PM",
  },
  {
    id: "TP-20260308-2006",
    restaurantName: "Burger Palace",
    customerName: "Kavya Nair",
    customerPhone: "+91 9334455667",
    deliveryAddress: "11, JP Nagar, Bangalore",
    items: [
      { name: "Veggie Burger", quantity: 1, price: 199 },
      { name: "Chocolate Shake", quantity: 1, price: 149 },
    ],
    totalPrice: 348,
    status: "Delivered",
    date: "2026-03-08",
    time: "7:15 PM",
  },
];

import foodBurger from "@/assets/food-burger.jpg";
import foodBeverages from "@/assets/food-beverages.jpg";

export const mockMenuItems: RestaurantMenuItem[] = [
  { id: "m1", name: "Classic Cheeseburger", description: "Juicy beef patty with melted cheddar, lettuce, tomato & special sauce", price: 249, offerPrice: 199, image: foodBurger, category: "Burgers", isVeg: false, isAvailable: true },
  { id: "m2", name: "Double Stack Burger", description: "Two beef patties, double cheese, caramelized onions", price: 399, image: foodBurger, category: "Burgers", isVeg: false, isAvailable: true },
  { id: "m3", name: "Veggie Burger", description: "Crispy veggie patty with fresh vegetables and herb mayo", price: 199, image: foodBurger, category: "Burgers", isVeg: true, isAvailable: true },
  { id: "m4", name: "French Fries", description: "Crispy golden fries with seasoning", price: 99, image: foodBurger, category: "Sides", isVeg: true, isAvailable: true },
  { id: "m5", name: "Chocolate Shake", description: "Rich chocolate milkshake topped with whipped cream", price: 149, image: foodBeverages, category: "Beverages", isVeg: true, isAvailable: false },
];

export const analyticsData = {
  daily: {
    totalOrders: 24,
    revenue: 12480,
    popularItems: [
      { name: "Classic Cheeseburger", orders: 12 },
      { name: "Double Stack Burger", orders: 6 },
      { name: "French Fries", orders: 18 },
      { name: "Veggie Burger", orders: 4 },
      { name: "Chocolate Shake", orders: 8 },
    ],
    orderTrend: [
      { hour: "9 AM", orders: 2 },
      { hour: "10 AM", orders: 3 },
      { hour: "11 AM", orders: 1 },
      { hour: "12 PM", orders: 5 },
      { hour: "1 PM", orders: 6 },
      { hour: "2 PM", orders: 3 },
      { hour: "3 PM", orders: 1 },
      { hour: "4 PM", orders: 0 },
      { hour: "5 PM", orders: 1 },
      { hour: "6 PM", orders: 2 },
      { hour: "7 PM", orders: 4 },
      { hour: "8 PM", orders: 5 },
      { hour: "9 PM", orders: 3 },
    ],
  },
  weekly: {
    totalOrders: 156,
    revenue: 78450,
    popularItems: [
      { name: "Classic Cheeseburger", orders: 68 },
      { name: "Double Stack Burger", orders: 34 },
      { name: "French Fries", orders: 112 },
      { name: "Veggie Burger", orders: 22 },
      { name: "Chocolate Shake", orders: 45 },
    ],
    orderTrend: [
      { hour: "Mon", orders: 18 },
      { hour: "Tue", orders: 22 },
      { hour: "Wed", orders: 20 },
      { hour: "Thu", orders: 25 },
      { hour: "Fri", orders: 30 },
      { hour: "Sat", orders: 28 },
      { hour: "Sun", orders: 13 },
    ],
  },
  monthly: {
    totalOrders: 648,
    revenue: 324000,
    popularItems: [
      { name: "Classic Cheeseburger", orders: 280 },
      { name: "Double Stack Burger", orders: 145 },
      { name: "French Fries", orders: 460 },
      { name: "Veggie Burger", orders: 90 },
      { name: "Chocolate Shake", orders: 185 },
    ],
    orderTrend: [
      { hour: "Week 1", orders: 140 },
      { hour: "Week 2", orders: 165 },
      { hour: "Week 3", orders: 178 },
      { hour: "Week 4", orders: 165 },
    ],
  },
  yearly: {
    totalOrders: 7850,
    revenue: 3925000,
    popularItems: [
      { name: "Classic Cheeseburger", orders: 3400 },
      { name: "Double Stack Burger", orders: 1750 },
      { name: "French Fries", orders: 5600 },
      { name: "Veggie Burger", orders: 1100 },
      { name: "Chocolate Shake", orders: 2250 },
    ],
    orderTrend: [
      { hour: "Jan", orders: 520 },
      { hour: "Feb", orders: 580 },
      { hour: "Mar", orders: 640 },
      { hour: "Apr", orders: 610 },
      { hour: "May", orders: 700 },
      { hour: "Jun", orders: 680 },
      { hour: "Jul", orders: 720 },
      { hour: "Aug", orders: 690 },
      { hour: "Sep", orders: 650 },
      { hour: "Oct", orders: 710 },
      { hour: "Nov", orders: 680 },
      { hour: "Dec", orders: 670 },
    ],
  },
};
