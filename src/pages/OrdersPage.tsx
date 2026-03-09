import { mockOrders, type OrderStatus } from "@/data/mockData";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck, ChefHat, CircleDot } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-bold">My Orders</h1>
      </div>

      <div className="space-y-3 px-4">
        {mockOrders.map((order, i) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">{order.restaurantName}</h3>
                </div>
                <span className={`flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium ${config.color}`}>
                  <StatusIcon size={12} />
                  {order.status}
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
                <span className="text-sm font-bold text-card-foreground">₹{order.totalPrice}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
