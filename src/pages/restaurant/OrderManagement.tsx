import { useState } from "react";
import type { RestaurantOrder, OrderStatus } from "@/types/models";
import { Clock, CheckCircle2, ChefHat, Package, Truck, CircleDot, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const statusFlow: OrderStatus[] = ["Ordered", "Accepted", "Preparing", "Ready", "Picked Up", "Delivered"];

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Ordered: { icon: CircleDot, color: "text-info", bg: "bg-info/10" },
  Accepted: { icon: Clock, color: "text-info", bg: "bg-info/10" },
  Preparing: { icon: ChefHat, color: "text-warning", bg: "bg-warning/10" },
  Ready: { icon: Package, color: "text-accent", bg: "bg-accent/10" },
  "Picked Up": { icon: Truck, color: "text-accent", bg: "bg-accent/10" },
  Delivered: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

const tabs: { label: string; statuses: OrderStatus[] }[] = [
  { label: "New", statuses: ["Ordered"] },
  { label: "Active", statuses: ["Accepted", "Preparing", "Ready"] },
  { label: "Completed", statuses: ["Picked Up", "Delivered"] },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const filteredOrders = orders.filter((o) => tabs[activeTab].statuses.includes(o.status));

  const advanceOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = statusFlow.indexOf(o.status);
        if (idx < statusFlow.length - 1) {
          const nextStatus = statusFlow[idx + 1];
          toast.success(`Order ${o.id} → ${nextStatus}`);
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  const getNextAction = (status: OrderStatus): string | null => {
    const map: Partial<Record<OrderStatus, string>> = {
      Ordered: "Accept Order",
      Accepted: "Start Preparing",
      Preparing: "Mark Ready",
    };
    return map[status] || null;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Order Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage incoming and active orders</p>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "New Orders", count: orders.filter((o) => o.status === "Ordered").length, color: "text-info" },
          { label: "In Progress", count: orders.filter((o) => ["Accepted", "Preparing"].includes(o.status)).length, color: "text-warning" },
          { label: "Ready", count: orders.filter((o) => o.status === "Ready").length, color: "text-accent" },
          { label: "Delivered Today", count: orders.filter((o) => o.status === "Delivered" && o.date === "2026-03-09").length, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 font-display text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-card p-1">
        {tabs.map((tab, i) => {
          const count = orders.filter((o) => tab.statuses.includes(o.status)).length;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === i ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Order Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const action = getNextAction(order.status);

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                    <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">
                      {order.customerName}
                    </h3>
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color} ${config.bg}`}>
                    <StatusIcon size={12} />
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-1 rounded-lg bg-muted/50 p-3">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.quantity}× {item.name}</span>
                      <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="mt-2 border-t border-border pt-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span>₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone size={11} />{order.customerPhone}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{order.deliveryAddress}</span>
                </div>

                {/* Action */}
                {action && (
                  <Button
                    onClick={() => advanceOrder(order.id)}
                    className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                  >
                    {action}
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-sm">No {tabs[activeTab].label.toLowerCase()} orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
