import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { useReviews } from "@/context/ReviewContext";
import { ArrowLeft, Phone, CheckCircle2, CircleDot, ChefHat, Package, Truck, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import ReviewDialog from "@/components/ReviewDialog";
import type { OrderStatus } from "@/data/mockData";

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType; description: string }[] = [
  { status: "Ordered", label: "Order Placed", icon: CircleDot, description: "Your order has been placed" },
  { status: "Accepted", label: "Accepted", icon: CheckCircle2, description: "Restaurant accepted your order" },
  { status: "Preparing", label: "Preparing", icon: ChefHat, description: "Your food is being prepared" },
  { status: "Ready", label: "Ready", icon: Package, description: "Order is ready for pickup" },
  { status: "Picked Up", label: "Picked Up", icon: Truck, description: "Delivery agent is on the way" },
  { status: "Delivered", label: "Delivered", icon: MapPin, description: "Order delivered successfully!" },
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrders();
  const { getReviewForOrder } = useReviews();
  const order = getOrder(id || "");
  const [showReview, setShowReview] = useState(false);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Order not found</p>
        <button onClick={() => navigate("/orders")} className="mt-3 text-sm font-medium text-accent underline">
          View All Orders
        </button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);
  const isDelivered = order.status === "Delivered";

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur-md">
        <button onClick={() => navigate("/orders")} className="rounded-full bg-card p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold">Order Tracking</h1>
          <p className="text-xs text-muted-foreground">{order.id}</p>
        </div>
      </div>

      {/* Live Status Banner */}
      <motion.div
        key={order.status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 rounded-2xl bg-primary p-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={!isDelivered ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20"
          >
            {(() => {
              const Icon = STATUS_STEPS[currentStepIndex]?.icon || CircleDot;
              return <Icon size={24} className="text-primary-foreground" />;
            })()}
          </motion.div>
          <div>
            <p className="text-sm font-bold text-primary-foreground">
              {STATUS_STEPS[currentStepIndex]?.description}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/70">
              <Clock size={10} />
              {isDelivered ? "Delivered" : `ETA: ${order.estimatedDelivery}`}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Stepper */}
      <div className="mx-4 mt-6">
        <h2 className="mb-4 font-display text-sm font-semibold text-foreground">Order Progress</h2>
        <div className="relative ml-2">
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            const historyEntry = order.statusHistory.find((h) => h.status === step.status);
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Vertical line */}
                {i < STATUS_STEPS.length - 1 && (
                  <div className="absolute left-[15px] top-[32px] h-[calc(100%-20px)] w-0.5">
                    <motion.div
                      className="h-full w-full rounded-full"
                      initial={{ scaleY: 0 }}
                      animate={{
                        scaleY: isCompleted ? 1 : 0,
                        backgroundColor: isCompleted
                          ? "hsl(var(--accent))"
                          : "hsl(var(--border))",
                      }}
                      style={{ originY: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                    {!isCompleted && (
                      <div className="absolute inset-0 rounded-full bg-border" />
                    )}
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    opacity: isCompleted ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    isCurrent
                      ? "bg-accent shadow-lg"
                      : isCompleted
                      ? "bg-accent/80"
                      : "bg-card"
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      isCompleted ? "text-accent-foreground" : "text-muted-foreground"
                    }
                  />
                </motion.div>

                {/* Text */}
                <div className="flex-1 pt-0.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${step.status}-${isCompleted}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted ? "text-card-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                        {isCurrent && !isDelivered && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="ml-2 inline-block h-2 w-2 rounded-full bg-accent"
                          />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {historyEntry ? formatTime(historyEntry.time) : step.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Agent */}
      <AnimatePresence>
        {order.deliveryAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-6 flex items-center gap-3 rounded-xl bg-card p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-display text-sm font-bold text-accent-foreground">
              {order.deliveryAgent.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">{order.deliveryAgent.name}</p>
              <p className="text-xs text-muted-foreground">Delivery Agent</p>
            </div>
            <a
              href={`tel:${order.deliveryAgent.phone}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"
            >
              <Phone size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Summary */}
      <div className="mx-4 mt-6 rounded-xl bg-card p-4">
        <h3 className="font-display text-sm font-semibold text-card-foreground">{order.restaurantName}</h3>
        <div className="mt-2 space-y-1">
          {order.items.map((item, j) => (
            <div key={j} className="flex justify-between text-xs text-muted-foreground">
              <span>{item.quantity}x {item.name}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-border pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          {order.discount && order.discount > 0 ? (
            <div className="mt-1 flex justify-between text-xs text-success">
              <span>Coupon Discount</span>
              <span>-₹{Math.round(order.discount)}</span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between text-sm font-bold text-card-foreground">
            <span>Total</span>
            <span>₹{Math.round(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Review Section - shown after delivery */}
      {isDelivered && (
        <div className="mx-4 mt-6">
          {!showReview && !getReviewForOrder(order.id) ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowReview(true)}
              className="w-full rounded-2xl bg-accent/15 p-4 text-center transition-colors hover:bg-accent/25"
            >
              <p className="font-display text-sm font-semibold text-accent-foreground">⭐ Rate your order</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Help us improve your experience</p>
            </motion.button>
          ) : (
            <ReviewDialog
              orderId={order.id}
              restaurantId={order.restaurantId}
              restaurantName={order.restaurantName}
              onClose={() => setShowReview(false)}
            />
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default OrderTrackingPage;
