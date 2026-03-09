import { useState } from "react";
import { mockDeliveryOrders, type DeliveryOrder } from "@/data/deliveryMockData";
import { MapPin, Clock, Store, Check, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const NearbyOrders = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(mockDeliveryOrders);

  // Only show orders within 5km that are "Ready" (available for pickup)
  const nearbyOrders = orders.filter(
    (o) => o.status === "Ready" && parseFloat(o.distance) <= 5
  );

  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Picked Up" as const } : o
      )
    );
    toast.success("Order accepted! Head to the restaurant for pickup.");
  };

  const rejectOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast("Order declined", { description: "It will be assigned to another agent." });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Nearby Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders within 5 km radius · {nearbyOrders.length} available
        </p>
      </div>

      {/* Radius indicator */}
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-card p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
          <Navigation size={18} className="text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-card-foreground">GPS Active</p>
          <p className="text-xs text-muted-foreground">Scanning for orders within 5 km of your location</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Online
          </span>
        </div>
      </div>

      {/* Order Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {nearbyOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              className="rounded-xl bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">
                    {order.restaurantName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
                    {order.distance}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">~{order.estimatedTime}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Store size={13} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-card-foreground">Pickup: {order.restaurantName}</p>
                    <p className="text-muted-foreground">{order.restaurantAddress}</p>
                  </div>
                </div>
                <div className="ml-[6px] h-3 border-l border-dashed border-border" />
                <div className="flex items-start gap-2 text-xs">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-info" />
                  <div>
                    <p className="font-medium text-card-foreground">Drop: {order.customerName}</p>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                {order.items.map((item, j) => (
                  <p key={j} className="text-xs text-foreground">
                    {item.quantity}× {item.name}
                  </p>
                ))}
                <p className="mt-1.5 border-t border-border pt-1.5 text-sm font-bold text-card-foreground">
                  Earnings: ₹{Math.round(order.totalPrice * 0.15 + 20)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectOrder(order.id)}
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <X size={14} className="mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => acceptOrder(order.id)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check size={14} className="mr-1" />
                  Accept
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {nearbyOrders.length === 0 && (
          <div className="flex flex-col items-center py-16">
            <Navigation size={48} className="text-muted-foreground/30" />
            <p className="mt-4 font-display text-base font-semibold text-muted-foreground">No nearby orders</p>
            <p className="mt-1 text-sm text-muted-foreground/70">New orders will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyOrders;
