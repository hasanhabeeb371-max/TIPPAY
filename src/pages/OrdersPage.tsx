import { mockOrders, type OrderStatus } from "@/data/mockData";
import { useOrders } from "@/context/OrderContext";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck, ChefHat, CircleDot, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string }> = {
  Ordered: { icon: CircleDot, color: "text-info" },
  Accepted: { icon: Clock, color: "text-info" },
  Preparing: { icon: ChefHat, color: "text-warning" },
  Ready: { icon: Package, color: "text-accent" },
  "Picked Up": { icon: Truck, color: "text-accent" },
  Delivered: { icon: CheckCircle2, color: "text-success" },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders: liveOrders } = useOrders();

  const allOrders = [
    ...liveOrders.map((o) => ({
      id: o.id,
      restaurantName: o.restaurantName,
      items: o.items,
      totalPrice: o.totalPrice,
      status: o.status,
      date: o.placedAt.toISOString().split("T")[0],
      time: o.placedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      isLive: true,
    })),
    ...mockOrders.map((o) => ({ ...o, isLive: false })),
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-bold">My Orders</h1>
      </div>

      <div className="space-y-3 px-4">
        {allOrders.map((order, i) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          const isActive = order.isLive && order.status !== "Delivered";
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => order.isLive ? navigate(`/order/${order.id}`) : null}
              className={`rounded-xl bg-card p-4 ${order.isLive ? "cursor-pointer transition-shadow hover:shadow-md" : ""} ${
                isActive ? "ring-2 ring-accent/50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">{order.restaurantName}</h3>
                </div>
                <span className={`flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium ${config.color}`}>
                  <StatusIcon size={12} />
                  {order.status}
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                </span>
              </div>
              <div className="mt-2 space-y-0.5">
                {order.items.map((item, j) => (
                  <p key={j} className="text-xs text-muted-foreground">
                    {item.quantity}x {item.name} — ₹{item.price * item.quantity}
                  </p>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <span className="text-xs text-muted-foreground">{order.date} · {order.time}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-card-foreground">₹{order.totalPrice}</span>
                  {order.isLive && <ChevronRight size={14} className="text-muted-foreground" />}
                </div>
              </div>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 rounded-lg bg-accent/10 px-3 py-1.5 text-center text-xs font-medium text-accent-foreground"
                >
                  Tap to track your order →
                </motion.div>
              )}
            </motion.div>
          );
        })}
        {allOrders.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No orders yet</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
