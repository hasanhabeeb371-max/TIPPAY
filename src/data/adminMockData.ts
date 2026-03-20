import foodBurger from "@/assets/food-burger.jpg";
import foodBiryani from "@/assets/food-biryani.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDosa from "@/assets/food-dosa.jpg";
import foodChinese from "@/assets/food-chinese.jpg";
import foodDessert from "@/assets/food-dessert.jpg";

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

export const adminRestaurants: AdminRestaurant[] = [
  { id: "ar1", name: "Burger Palace", image: foodBurger, owner: "Rajesh Kumar", email: "rajesh@burgerpalace.com", phone: "+91 9876543210", location: "Karnataka", gstin: "29ABCDE1234F1Z5", category: "Fast Food", status: "approved", appliedDate: "2025-12-15" },
  { id: "ar2", name: "Spice Garden", image: foodBiryani, owner: "Meena Iyer", email: "meena@spicegarden.com", phone: "+91 9123456789", location: "Karnataka", gstin: "29FGHIJ5678K2Z6", category: "North Indian", status: "approved", appliedDate: "2026-01-10" },
  { id: "ar3", name: "Pizza Hub", image: foodPizza, owner: "Arjun Mehta", email: "arjun@pizzahub.com", phone: "+91 9988776655", location: "Karnataka", gstin: "29KLMNO9012L3Z7", category: "Pizza", status: "approved", appliedDate: "2026-01-22" },
  { id: "ar4", name: "Dosa Corner", image: foodDosa, owner: "Lakshmi Rao", email: "lakshmi@dosacorner.com", phone: "+91 9112233445", location: "Karnataka", gstin: "29PQRST3456M4Z8", category: "South Indian", status: "approved", appliedDate: "2026-02-05" },
  { id: "ar5", name: "Tandoori Nights", image: foodBiryani, owner: "Farhan Sheikh", email: "farhan@tandoorinights.com", phone: "+91 9556677889", location: "Maharashtra", gstin: "27UVWXY7890N5Z9", category: "North Indian", status: "pending", appliedDate: "2026-03-07" },
  { id: "ar6", name: "Wok Express", image: foodChinese, owner: "Chen Wei", email: "chen@wokexpress.com", phone: "+91 9334455667", location: "Karnataka", gstin: "29ABCFG1234O6Z0", category: "Chinese", status: "pending", appliedDate: "2026-03-08" },
  { id: "ar7", name: "Sweet Bliss", image: foodDessert, owner: "Ananya Desai", email: "ananya@sweetbliss.com", phone: "+91 9778899001", location: "Tamil Nadu", gstin: "33HIJKL5678P7Z1", category: "Desserts", status: "suspended", appliedDate: "2026-02-20" },
];

export const adminOrders: AdminOrder[] = [
  { id: "TP-20260309-4001", customerName: "Rahul Sharma", restaurantName: "Burger Palace", deliveryAgent: "Suresh M.", items: [{ name: "Classic Cheeseburger", quantity: 2 }, { name: "French Fries", quantity: 1 }], totalPrice: 497, status: "Preparing", date: "2026-03-09", time: "1:30 PM" },
  { id: "TP-20260309-4002", customerName: "Priya Patel", restaurantName: "Pizza Hub", deliveryAgent: null, items: [{ name: "Margherita Pizza", quantity: 1 }], totalPrice: 249, status: "Ordered", date: "2026-03-09", time: "1:25 PM" },
  { id: "TP-20260309-4003", customerName: "Amit Kumar", restaurantName: "Spice Garden", deliveryAgent: "Ravi K.", items: [{ name: "Hyderabadi Biryani", quantity: 1 }], totalPrice: 299, status: "Picked Up", date: "2026-03-09", time: "1:00 PM" },
  { id: "TP-20260309-4004", customerName: "Sneha Reddy", restaurantName: "Dragon Wok", deliveryAgent: "Suresh M.", items: [{ name: "Hakka Noodles", quantity: 2 }], totalPrice: 338, status: "Delivered", date: "2026-03-09", time: "12:30 PM" },
  { id: "TP-20260308-4005", customerName: "Vikram Singh", restaurantName: "Dosa Corner", deliveryAgent: "Ravi K.", items: [{ name: "Masala Dosa", quantity: 3 }], totalPrice: 357, status: "Delivered", date: "2026-03-08", time: "8:00 PM" },
  { id: "TP-20260308-4006", customerName: "Kavya Nair", restaurantName: "Burger Palace", deliveryAgent: "Mohan P.", items: [{ name: "Veggie Burger", quantity: 1 }], totalPrice: 199, status: "Delivered", date: "2026-03-08", time: "7:15 PM" },
];

export const adminAgents: AdminAgent[] = [
  { id: "ag1", name: "Suresh M.", email: "suresh@tippay.agent.com", phone: "+91 9876500001", completedDeliveries: 245, rating: 4.8, status: "active", joinedDate: "2025-11-01" },
  { id: "ag2", name: "Ravi K.", email: "ravi@tippay.agent.com", phone: "+91 9876500002", completedDeliveries: 189, rating: 4.6, status: "active", joinedDate: "2025-12-15" },
  { id: "ag3", name: "Mohan P.", email: "mohan@tippay.agent.com", phone: "+91 9876500003", completedDeliveries: 312, rating: 4.9, status: "active", joinedDate: "2025-10-10" },
  { id: "ag4", name: "Deepak R.", email: "deepak@tippay.agent.com", phone: "+91 9876500004", completedDeliveries: 78, rating: 4.3, status: "inactive", joinedDate: "2026-01-20" },
  { id: "ag5", name: "Kiran S.", email: "kiran@tippay.agent.com", phone: "+91 9876500005", completedDeliveries: 156, rating: 4.7, status: "active", joinedDate: "2025-12-01" },
];

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 9876543210", totalOrders: 24, joinedDate: "2025-12-01" },
  { id: "u2", name: "Priya Patel", email: "priya@gmail.com", phone: "+91 9123456789", totalOrders: 18, joinedDate: "2026-01-05" },
  { id: "u3", name: "Amit Kumar", email: "amit@gmail.com", phone: "+91 9988776655", totalOrders: 31, joinedDate: "2025-11-15" },
  { id: "u4", name: "Sneha Reddy", email: "sneha@gmail.com", phone: "+91 9112233445", totalOrders: 12, joinedDate: "2026-02-10" },
  { id: "u5", name: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 9556677889", totalOrders: 42, joinedDate: "2025-10-20" },
  { id: "u6", name: "Kavya Nair", email: "kavya@gmail.com", phone: "+91 9334455667", totalOrders: 8, joinedDate: "2026-03-01" },
];

export const adminOverview = {
  totalRestaurants: 6,
  totalOrders: 7850,
  totalUsers: 1240,
  totalAgents: 45,
  pendingApprovals: 2,
  todayOrders: 24,
  todayRevenue: 12480,
};
