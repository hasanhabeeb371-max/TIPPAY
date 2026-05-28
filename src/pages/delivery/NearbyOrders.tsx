import { useState, useEffect } from "react";
import type { DeliveryOrder } from "@/types/models";
import { MapPin, Clock, Store, Check, X, Navigation, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const NearbyOrders = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    const saved = localStorage.getItem("tippay_delivery_orders");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("tippay_delivery_orders", JSON.stringify(orders));
  }, [orders]);

  // Only show orders within 5km that are "Ready" or "Preparing"
  const nearbyOrders = orders.filter(
    (o) => (o.status === "Ready" || o.status === "Preparing") && parseFloat(o.distance) <= 5
  );

  const activeCount = orders.filter((o) => o.status === "Picked Up").length;

  const acceptOrder = (orderId: string) => {
    if (activeCount >= 3) {
      toast.error("Rider Dispatch Limit Reached", {
        description: "You cannot accept more than 3 active orders. Please deliver your current batch first.",
        icon: <AlertTriangle className="text-destructive" />,
      });
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Picked Up" as const } : o
      )
    );
    toast.success("Order accepted! Added to your active delivery batch.");
  };

  const rejectOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast("Order declined", { description: "It will be reassigned to another rider." });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Nearby Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders within 5 km radius · {nearbyOrders.length} available for pickup
        </p>
      </div>

      {/* Radius indicator */}
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-card p-4 border border-border/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
          <Navigation size={18} className="text-accent animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground">GPS Scan Active</p>
          <p className="text-xs text-muted-foreground truncate">Batch accepted: {activeCount}/3 orders</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
            Online
          </span>
        </div>
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {nearbyOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              className="rounded-xl border border-border/40 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">
                    {order.restaurantName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    {order.distance}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">~{order.estimatedTime}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="mt-3 space-y-2 border-t border-border/20 pt-3">
                <div className="flex items-start gap-2 text-xs">
                  <Store size={13} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-card-foreground">Pickup: {order.restaurantName}</p>
                    <p className="text-muted-foreground text-[11px]">{order.restaurantAddress}</p>
                  </div>
                </div>
                <div className="ml-[6px] h-3 border-l border-dashed border-border/30" />
                <div className="flex items-start gap-2 text-xs">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-info" />
                  <div>
                    <p className="font-medium text-card-foreground">Drop: {order.customerName}</p>
                    <p className="text-muted-foreground text-[11px]">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="mt-3 rounded-lg bg-muted/40 p-3 text-xs">
                <p className="mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Items</p>
                {order.items.map((item, j) => (
                  <p key={j} className="text-foreground/90">
                    {item.quantity}× {item.name}
                  </p>
                ))}
                <p className="mt-2 border-t border-border/20 pt-1.5 font-bold text-card-foreground">
                  Earnings: ₹{Math.round(order.totalPrice * 0.15 + 20)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectOrder(order.id)}
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                >
                  <X size={13} className="mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => acceptOrder(order.id)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold"
                >
                  <Check size={13} className="mr-1" />
                  Accept Order
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {nearbyOrders.length === 0 && (
          <div className="flex flex-col items-center py-16 bg-card rounded-2xl border border-dashed border-border/30 text-center">
            <Navigation size={48} className="text-muted-foreground/30 mb-2" />
            <p className="font-display text-sm font-semibold text-muted-foreground">No nearby orders</p>
            <p className="text-xs text-muted-foreground/80 mt-0.5">New ready orders will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyOrders;
