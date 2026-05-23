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
  discount?: number;
  status: OrderStatus;
  placedAt: Date;
  estimatedDelivery: string;
  paymentMethod: string;
  deliveryAgent?: { name: string; phone: string };
  statusHistory: { status: OrderStatus; time: Date }[];
}

interface OrderContextType {
  orders: LiveOrder[];
  activeOrder: LiveOrder | null;
  placeOrder: (order: Omit<LiveOrder, "id" | "status" | "placedAt" | "statusHistory">) => string;
  getOrder: (id: string) => LiveOrder | undefined;
  cancelOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STATUS_FLOW: OrderStatus[] = ["Ordered", "Accepted", "Preparing", "Ready", "Picked Up", "Delivered"];

const AGENT_NAMES = ["Rajesh K.", "Priya M.", "Arun S.", "Meena R.", "Vikram P."];
const ORDERS_STORAGE_KEY = "tippay_live_orders";

function parseStoredOrders(): LiveOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LiveOrder[];
    return parsed.map((o) => ({
      ...o,
      placedAt: new Date(o.placedAt),
      statusHistory: o.statusHistory.map((h) => ({ ...h, time: new Date(h.time) })),
    }));
  } catch {
    return [];
  }
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<LiveOrder[]>(parseStoredOrders);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const timersResumedRef = useRef(false);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "Delivered", // Marks as done/removed from active
          statusHistory: [...o.statusHistory, { status: "Delivered", time: new Date() }]
        };
      })
    );
    // Cancel any scheduled status advances
    for (let i = 0; i < STATUS_FLOW.length; i++) {
      const timer = timersRef.current.get(`${orderId}-${i}`);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(`${orderId}-${i}`);
      }
    }
  }, []);

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
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (timersResumedRef.current) return;
    timersResumedRef.current = true;
    orders.forEach((order) => {
      if (order.status === "Delivered") return;
      const stepIndex = STATUS_FLOW.indexOf(order.status);
      if (stepIndex >= 0 && stepIndex < STATUS_FLOW.length - 1) {
        scheduleAdvance(order.id, stepIndex);
      }
    });
    // Resume status timers only for orders restored on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <OrderContext.Provider value={{ orders, activeOrder, placeOrder, getOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
