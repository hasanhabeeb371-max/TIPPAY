import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { OrderStatus } from "@/data/mockData";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface LiveOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryFee: number;
  status: OrderStatus;
  placedAt: Date;
  estimatedDelivery: string;
  deliveryAgent?: { name: string; phone: string };
  statusHistory: { status: OrderStatus; time: Date }[];
}

interface OrderContextType {
  orders: LiveOrder[];
  activeOrder: LiveOrder | null;
  placeOrder: (order: Omit<LiveOrder, "id" | "status" | "placedAt" | "statusHistory">) => string;
  getOrder: (id: string) => LiveOrder | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STATUS_FLOW: OrderStatus[] = ["Ordered", "Accepted", "Preparing", "Ready", "Picked Up", "Delivered"];

const AGENT_NAMES = ["Rajesh K.", "Priya M.", "Arun S.", "Meena R.", "Vikram P."];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const advanceStatus = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentIdx = STATUS_FLOW.indexOf(o.status);
        if (currentIdx >= STATUS_FLOW.length - 1) return o;
        const nextStatus = STATUS_FLOW[currentIdx + 1];
        const updated: LiveOrder = {
          ...o,
          status: nextStatus,
          statusHistory: [...o.statusHistory, { status: nextStatus, time: new Date() }],
          ...(nextStatus === "Picked Up" && !o.deliveryAgent
            ? { deliveryAgent: { name: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)], phone: "+91 98765 43210" } }
            : {}),
        };
        return updated;
      })
    );
  }, []);

  const scheduleAdvance = useCallback(
    (orderId: string, stepIndex: number) => {
      if (stepIndex >= STATUS_FLOW.length - 1) return;
      const delays = [5000, 8000, 10000, 6000, 7000]; // time between each status
      const timer = setTimeout(() => {
        advanceStatus(orderId);
        scheduleAdvance(orderId, stepIndex + 1);
      }, delays[stepIndex] || 6000);
      timersRef.current.set(`${orderId}-${stepIndex}`, timer);
    },
    [advanceStatus]
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const placeOrder = useCallback(
    (orderData: Omit<LiveOrder, "id" | "status" | "placedAt" | "statusHistory">) => {
      const id = `TP-${Date.now().toString().slice(-8)}`;
      const newOrder: LiveOrder = {
        ...orderData,
        id,
        status: "Ordered",
        placedAt: new Date(),
        statusHistory: [{ status: "Ordered", time: new Date() }],
      };
      setOrders((prev) => [newOrder, ...prev]);
      scheduleAdvance(id, 0);
      return id;
    },
    [scheduleAdvance]
  );

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const activeOrder = orders.find((o) => o.status !== "Delivered") || null;

  return (
    <OrderContext.Provider value={{ orders, activeOrder, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
