import type { AdminOrder } from "@/types/models";
const adminOrders: AdminOrder[] = [];
import { CircleDot, Clock, ChefHat, Package, Truck, CheckCircle2, User, Store } from "lucide-react";
import { motion } from "framer-motion";

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Ordered: { icon: CircleDot, color: "text-info", bg: "bg-info/10" },
  Accepted: { icon: Clock, color: "text-info", bg: "bg-info/10" },
  Preparing: { icon: ChefHat, color: "text-warning", bg: "bg-warning/10" },
  Ready: { icon: Package, color: "text-accent", bg: "bg-accent/10" },
  "Picked Up": { icon: Truck, color: "text-accent", bg: "bg-accent/10" },
  Delivered: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

const AdminOrders = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Order Monitoring</h2>
        <p className="mt-1 text-sm text-muted-foreground">{adminOrders.length} orders tracked</p>
      </div>

      {/* Table-like cards */}
      <div className="hidden md:block">
        <div className="rounded-xl bg-card overflow-hidden">
          <div className="grid grid-cols-7 gap-2 border-b border-border bg-muted/50 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Restaurant</span>
            <span>Agent</span>
            <span>Total</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {adminOrders.map((order, i) => {
            const config = statusConfig[order.status] || statusConfig.Ordered;
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-7 gap-2 border-b border-border px-4 py-3 text-sm last:border-0"
              >
                <span className="truncate font-mono text-xs text-muted-foreground">{order.id}</span>
                <span className="truncate text-xs text-foreground">{order.customerName}</span>
                <span className="truncate text-xs text-foreground">{order.restaurantName}</span>
                <span className="truncate text-xs text-muted-foreground">{order.deliveryAgent || "—"}</span>
                <span className="text-xs font-semibold text-foreground">₹{order.totalPrice}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
                  <StatusIcon size={11} />{order.status}
                </span>
                <span className="text-xs text-muted-foreground">{order.time}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {adminOrders.map((order, i) => {
          const config = statusConfig[order.status] || statusConfig.Ordered;
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <User size={11} className="text-muted-foreground" />
                    <span className="text-foreground">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Store size={11} className="text-muted-foreground" />
                    <span className="text-foreground">{order.restaurantName}</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color} ${config.bg}`}>
                  <StatusIcon size={11} />{order.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                <span className="text-muted-foreground">Agent: {order.deliveryAgent || "Unassigned"}</span>
                <span className="font-bold text-foreground">₹{order.totalPrice}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
