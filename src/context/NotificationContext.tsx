import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth, type UserRole } from "./AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promo" | "system" | "delivery" | "alert";
  read: boolean;
  createdAt: Date;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const generateMockNotifications = (role: UserRole): Notification[] => {
  const now = new Date();
  const mins = (m: number) => new Date(now.getTime() - m * 60000);

  const common: Notification[] = [
    { id: "sys-1", title: "Welcome to TIP PAY!", message: "Your account is all set up and ready to go.", type: "system", read: false, createdAt: mins(5) },
  ];

  if (role === "customer") return [
    { id: "c-1", title: "Order Delivered!", message: "Your Biryani order from Spice Kitchen has been delivered.", type: "order", read: false, createdAt: mins(2) },
    { id: "c-2", title: "🔥 Flash Sale", message: "50% off on all pizzas today! Use code PIZZA50.", type: "promo", read: false, createdAt: mins(15) },
    { id: "c-3", title: "Rate Your Order", message: "How was your burger from Burger Hub? Tap to rate.", type: "order", read: false, createdAt: mins(45) },
    { id: "c-4", title: "Order on the way", message: "Your delivery agent Ravi is 5 mins away.", type: "delivery", read: true, createdAt: mins(60) },
    ...common,
  ];

  if (role === "restaurant") return [
    { id: "r-1", title: "New Order #TP-3045", message: "2x Paneer Butter Masala, 1x Naan — ₹480", type: "order", read: false, createdAt: mins(1) },
    { id: "r-2", title: "New Order #TP-3044", message: "1x Chicken Biryani, 1x Raita — ₹320", type: "order", read: false, createdAt: mins(8) },
    { id: "r-3", title: "Order Cancelled", message: "Order #TP-3040 was cancelled by customer.", type: "alert", read: false, createdAt: mins(20) },
    { id: "r-4", title: "Weekly Report Ready", message: "Your weekly analytics report is now available.", type: "system", read: true, createdAt: mins(120) },
    ...common,
  ];

  if (role === "delivery") return [
    { id: "d-1", title: "New Order Nearby", message: "Pickup from Biryani House (1.2 km) — ₹85 earnings", type: "order", read: false, createdAt: mins(1) },
    { id: "d-2", title: "Bonus Unlocked! 🎉", message: "Complete 3 more deliveries for ₹150 bonus.", type: "promo", read: false, createdAt: mins(10) },
    { id: "d-3", title: "Customer Rated 5⭐", message: "Great job! You received a 5-star rating.", type: "system", read: false, createdAt: mins(30) },
    { id: "d-4", title: "Surge Zone Active", message: "High demand in Koramangala — 1.5x pay!", type: "alert", read: true, createdAt: mins(45) },
    ...common,
  ];

  if (role === "admin") return [
    { id: "a-1", title: "New Restaurant Signup", message: "Tandoori Nights has applied for onboarding.", type: "alert", read: false, createdAt: mins(3) },
    { id: "a-2", title: "High Cancellation Rate", message: "Pizza Planet has 25% cancellation rate this week.", type: "alert", read: false, createdAt: mins(12) },
    { id: "a-3", title: "Agent Complaint", message: "Delivery agent Suresh reported a navigation issue.", type: "system", read: false, createdAt: mins(25) },
    { id: "a-4", title: "Daily Revenue: ₹1.2L", message: "Revenue is up 12% compared to yesterday.", type: "system", read: true, createdAt: mins(60) },
    { id: "a-5", title: "System Update", message: "Platform v2.1 deployed successfully.", type: "system", read: true, createdAt: mins(180) },
    ...common,
  ];

  return common;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      setNotifications(generateMockNotifications(user.role));
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Simulate a new notification every 30 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const newNotif: Notification = {
        id: `live-${Date.now()}`,
        title: user.role === "customer" ? "Special Offer!" : user.role === "restaurant" ? "New Order Incoming" : user.role === "delivery" ? "New Nearby Order" : "Activity Alert",
        message: user.role === "customer" ? "Free delivery on your next order!" : user.role === "restaurant" ? "A new order just came in." : user.role === "delivery" ? "A pickup is available nearby." : "New user registered.",
        type: user.role === "customer" ? "promo" : "order",
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
