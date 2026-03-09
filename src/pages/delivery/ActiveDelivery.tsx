import { useState } from "react";
import { mockDeliveryOrders, type DeliveryOrder } from "@/data/deliveryMockData";
import { MapPin, Phone, Store, Navigation, CheckCircle2, Package, Truck, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActiveStep = "heading_to_restaurant" | "at_restaurant" | "picked_up" | "delivered";

const stepLabels: Record<ActiveStep, { label: string; icon: React.ElementType; color: string }> = {
  heading_to_restaurant: { label: "Heading to Restaurant", icon: Navigation, color: "text-info" },
  at_restaurant: { label: "At Restaurant", icon: Store, color: "text-warning" },
  picked_up: { label: "Picked Up – Delivering", icon: Truck, color: "text-accent" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-success" },
};

const allSteps: ActiveStep[] = ["heading_to_restaurant", "at_restaurant", "picked_up", "delivered"];

const ActiveDelivery = () => {
  // Simulate an active delivery from the "Picked Up" orders
  const activeOrders = mockDeliveryOrders.filter((o) => o.status === "Picked Up");
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder | null>(activeOrders[0] || null);
  const [step, setStep] = useState<ActiveStep>("heading_to_restaurant");
  const [showPickupDialog, setShowPickupDialog] = useState(false);
  const [pickupCode, setPickupCode] = useState("");

  const handleArrivedAtRestaurant = () => {
    setStep("at_restaurant");
    setShowPickupDialog(true);
  };

  const handleConfirmPickup = () => {
    if (!pickupCode.trim()) {
      toast.error("Please enter the Order ID");
      return;
    }
    if (currentOrder && pickupCode.trim().toUpperCase() === currentOrder.id) {
      setShowPickupDialog(false);
      setStep("picked_up");
      setPickupCode("");
      toast.success("Pickup confirmed! Head to the delivery address.");
    } else {
      toast.error("Invalid Order ID. Please check and try again.");
    }
  };

  const handleMarkDelivered = () => {
    setStep("delivered");
    toast.success("Order delivered successfully! 🎉", { description: "Great job!" });
    setTimeout(() => {
      setCurrentOrder(null);
    }, 2000);
  };

  if (!currentOrder) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">Active Delivery</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your current delivery assignment</p>
        </div>
        <div className="flex flex-col items-center py-20">
          <Truck size={56} className="text-muted-foreground/30" />
          <p className="mt-4 font-display text-base font-semibold text-muted-foreground">No active delivery</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Accept an order from Nearby Orders to start</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = allSteps.indexOf(step);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Active Delivery</h2>
        <p className="mt-1 text-sm text-muted-foreground">Order {currentOrder.id}</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6 rounded-xl bg-card p-4">
        <div className="flex items-center justify-between">
          {allSteps.map((s, i) => {
            const config = stepLabels[s];
            const Icon = config.icon;
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={s} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div className={`h-0.5 flex-1 ${i <= currentStepIndex ? "bg-accent" : "bg-border"}`} />
                  )}
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCompleted ? "bg-success" : isCurrent ? "bg-accent" : "bg-muted"
                    }`}
                  >
                    <Icon size={14} className={isCompleted || isCurrent ? "text-background" : "text-muted-foreground"} />
                  </motion.div>
                  {i < allSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${i < currentStepIndex ? "bg-accent" : "bg-border"}`} />
                  )}
                </div>
                <span className={`mt-1.5 text-center text-[9px] leading-tight ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Card */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="font-display text-sm font-semibold text-card-foreground">Order Details</h3>

        {/* Route */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <Store size={16} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="text-xs font-semibold text-card-foreground">Pickup: {currentOrder.restaurantName}</p>
              <p className="text-xs text-muted-foreground">{currentOrder.restaurantAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-info" />
            <div>
              <p className="text-xs font-semibold text-card-foreground">Drop: {currentOrder.customerName}</p>
              <p className="text-xs text-muted-foreground">{currentOrder.deliveryAddress}</p>
              <a href={`tel:${currentOrder.customerPhone}`} className="mt-1 flex items-center gap-1 text-xs text-accent">
                <Phone size={11} />
                {currentOrder.customerPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</p>
          {currentOrder.items.map((item, j) => (
            <p key={j} className="text-xs text-foreground">{item.quantity}× {item.name}</p>
          ))}
          <p className="mt-2 border-t border-border pt-2 text-sm font-bold">Total: ₹{currentOrder.totalPrice}</p>
        </div>

        {/* Actions based on step */}
        <div className="mt-4">
          {step === "heading_to_restaurant" && (
            <Button
              onClick={handleArrivedAtRestaurant}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Store size={16} className="mr-2" />
              Arrived at Restaurant
            </Button>
          )}
          {step === "at_restaurant" && (
            <Button
              onClick={() => setShowPickupDialog(true)}
              className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
            >
              <ClipboardCheck size={16} className="mr-2" />
              Confirm Pickup
            </Button>
          )}
          {step === "picked_up" && (
            <Button
              onClick={handleMarkDelivered}
              className="w-full bg-success text-success-foreground hover:bg-success/90"
            >
              <CheckCircle2 size={16} className="mr-2" />
              Mark as Delivered
            </Button>
          )}
          {step === "delivered" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center rounded-xl bg-success/10 py-6"
            >
              <CheckCircle2 size={40} className="text-success" />
              <p className="mt-2 font-display text-lg font-bold text-success">Delivered!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pickup Confirmation Dialog */}
      <Dialog open={showPickupDialog} onOpenChange={setShowPickupDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Pickup</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Enter the Order ID shown at the restaurant to confirm pickup.
          </p>
          <Input
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            placeholder="e.g. TP-20260309-3001"
            className="mt-2 font-mono text-sm"
          />
          <div className="mt-3 flex gap-2">
            <Button variant="outline" onClick={() => setShowPickupDialog(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirmPickup} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDelivery;
