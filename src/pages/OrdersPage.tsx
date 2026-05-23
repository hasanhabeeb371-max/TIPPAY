import { useState } from "react";
import { mockOrders, type OrderStatus } from "@/data/mockData";
import { useOrders } from "@/context/OrderContext";
import { useCravings } from "@/context/CravingsContext";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck, ChefHat, CircleDot, ChevronRight, MessageSquare, Utensils, Star, BadgePercent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";

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
  const { cravings, acceptOffer, rejectOffer } = useCravings();
  const { t, formatPrice } = useTranslation();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"orders" | "cravings">("orders");

  const customerCravings = cravings.filter(c => c.customerEmail === user?.email);

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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md border-b border-border/20">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-bold">{t("nav.orders")}</h1>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
              activeTab === "orders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("nav.orders")}
          </button>
          <button
            onClick={() => setActiveTab("cravings")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
              activeTab === "cravings" ? "bg-accent/20 text-accent font-bold" : "text-muted-foreground hover:text-accent"
            }`}
          >
            <Utensils size={12} />
            {t("craving.myRequests")}
          </button>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === "orders" ? (
            <motion.div
              key="orders-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {allOrders.map((order, i) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                const isActive = order.isLive && order.status !== "Delivered";
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => order.isLive ? navigate(`/order/${order.id}`) : null}
                    className={`rounded-xl bg-card p-4 border border-border/40 shadow-sm ${order.isLive ? "cursor-pointer transition-all hover:border-accent hover:shadow-md" : ""} ${
                      isActive ? "ring-1 ring-accent" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground">{order.id}</p>
                        <h3 className="mt-0.5 font-display text-sm font-semibold text-card-foreground">{order.restaurantName}</h3>
                      </div>
                      <span className={`flex items-center gap-1 rounded-full bg-accent/5 px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                        <StatusIcon size={11} />
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
                          {item.quantity}x {item.name} — {formatPrice(item.price * item.quantity)}
                        </p>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border/20 pt-2.5">
                      <span className="text-[10px] text-muted-foreground">{order.date} · {order.time}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-card-foreground">{formatPrice(order.totalPrice)}</span>
                        {order.isLive && <ChevronRight size={14} className="text-muted-foreground" />}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2.5 rounded-lg bg-accent/10 px-3 py-1.5 text-center text-xs font-semibold text-accent-foreground"
                      >
                        Tap to track your order →
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              {allOrders.length === 0 && (
                <p className="py-12 text-center text-muted-foreground">{t("cart.empty")}</p>
              )}
            </motion.div>
          ) : (
            /* Custom Cravings requests */
            <motion.div
              key="cravings-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {customerCravings.map((craving, i) => (
                <motion.div
                  key={craving.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {craving.dishName}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Broadcasted {new Date(craving.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        craving.status === "active"
                          ? "bg-accent/10 text-accent animate-pulse"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {craving.status === "active" ? "Broadcasting..." : "Fulfilled"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/20">
                    {craving.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs border-b border-border/10 pb-3">
                    <div className="flex gap-1.5">
                      {craving.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-muted-foreground">
                      Budget: <span className="font-bold text-foreground">{formatPrice(craving.maxPrice)}</span>
                    </span>
                  </div>

                  {/* Offers Section */}
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MessageSquare size={12} />
                      Chef Offers ({craving.offers.length})
                    </h4>

                    {craving.offers.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center italic">
                        Waiting for local restaurant offers...
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {craving.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className={`rounded-xl border p-3 ${
                              offer.status === "accepted"
                                ? "border-success/50 bg-success/5"
                                : "border-border/30 bg-muted/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-xs font-bold text-foreground">
                                  {offer.restaurantName}
                                </h5>
                                <p className="text-[9px] text-muted-foreground">
                                  Prep: {offer.prepTime}
                                </p>
                              </div>
                              <span className="text-xs font-extrabold text-accent">
                                {formatPrice(offer.price)}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-1.5 bg-card/60 p-2 rounded-lg italic">
                              "{offer.message}"
                            </p>

                            {craving.status === "active" && offer.status === "pending" && (
                              <div className="mt-2.5 flex gap-2">
                                <button
                                  onClick={() => rejectOffer(craving.id, offer.id)}
                                  className="flex-1 rounded-lg border border-destructive/20 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive/5"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => {
                                    acceptOffer(craving.id, offer.id);
                                    navigate("/cart");
                                  }}
                                  className="flex-1 rounded-lg bg-accent py-1.5 text-[10px] font-extrabold text-accent-foreground hover:brightness-105"
                                >
                                  Accept & Add to Cart
                                </button>
                              </div>
                            )}

                            {offer.status === "accepted" && (
                              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-success">
                                <CheckCircle2 size={11} /> Accepted Offer
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {customerCravings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Utensils size={36} className="text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground italic">You haven't requested any custom dishes yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersPage;
