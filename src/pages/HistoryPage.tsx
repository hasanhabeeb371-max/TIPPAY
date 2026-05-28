import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { useOrders } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { useTranslation } from "@/context/LanguageContext";

import heroBanner from "@/assets/hero-banner.jpg";
import { toast } from "sonner";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { orders: liveOrders } = useOrders();
  const { addItem, clearCart } = useCart();
  const { restaurants } = useRestaurants();
  const { formatPrice } = useTranslation();

  const previousOrders = useMemo(
    () =>
      [
        ...liveOrders,
      ].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime()),
    [liveOrders]
  );

  const handleOrderAgain = (order: (typeof previousOrders)[number]) => {
    const restaurant = restaurants.find((r) => r.id === order.restaurantId || r.name === order.restaurantName);
    const restaurantId =
      restaurant?.id || order.restaurantId || `previous-${order.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    let addedCount = 0;

    clearCart();
    order.items.forEach((orderItem, index) => {
      const menuItem = restaurant?.menu.find((item) => item.name.toLowerCase() === orderItem.name.toLowerCase()) ?? {
        id: `history-${order.id}-${index}`,
        name: orderItem.name,
        description: `From order history at ${order.restaurantName}`,
        price: orderItem.price,
        image: orderItem.image || restaurant?.image || heroBanner,
        category: "Previous Order",
        isVeg: true,
      };

      for (let i = 0; i < orderItem.quantity; i += 1) {
        addItem(menuItem, restaurantId, order.restaurantName);
        addedCount += 1;
      }
    });

    if (addedCount === 0) {
      toast.error("No items found in this order.");
      return;
    }

    toast.success(`${order.restaurantName} order added to cart`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border/10 bg-background/95 px-4 py-4 backdrop-blur-md">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="font-display text-lg font-bold">History</h1>
          <p className="text-xs text-muted-foreground">Previous orders</p>
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4">
        {previousOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl border border-border/40 bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-muted-foreground">{order.id}</p>
                <h2 className="mt-0.5 truncate font-display text-sm font-bold text-card-foreground">
                  {order.restaurantName}
                </h2>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {order.placedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                  {formatPrice(Math.round(order.totalPrice))}
                </p>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {order.status}
              </span>
            </div>

            <div className="mt-3 space-y-1 rounded-lg bg-muted/40 p-3">
              {order.items.map((item, itemIndex) => (
                <p key={`${order.id}-${item.name}-${itemIndex}`} className="text-xs text-muted-foreground">
                  {item.quantity}x {item.name} · {formatPrice(item.price * item.quantity)}
                </p>
              ))}
            </div>

            <Button
              onClick={() => handleOrderAgain(order)}
              className="mt-3 h-10 w-full bg-accent text-xs font-bold text-accent-foreground hover:bg-accent/90"
            >
              <ShoppingBag size={14} className="mr-2" />
              Order again
            </Button>
          </motion.div>
        ))}

        {previousOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card px-4 py-14 text-center">
            <History size={36} className="text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-card-foreground">No order history yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Your recent orders will appear here.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoryPage;
