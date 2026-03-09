import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 30 : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    const restaurantName = items[0].restaurantName;
    const restaurantId = items[0].restaurantId;
    const orderId = placeOrder({
      restaurantId,
      restaurantName,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.offerPrice || i.price,
        image: i.image,
      })),
      totalPrice: grandTotal,
      deliveryFee,
      estimatedDelivery: "25-35 min",
    });
    clearCart();
    toast.success("Order placed successfully! 🎉");
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-bold">My Cart</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="ml-auto text-xs text-destructive">Clear All</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 pt-20">
          <ShoppingBag size={64} className="text-muted-foreground/30" />
          <p className="mt-4 font-display text-lg font-semibold text-muted-foreground">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Add items from a restaurant to get started</p>
          <Button onClick={() => navigate("/home")} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <div className="px-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-3 flex items-center gap-3 rounded-xl bg-card p-3"
              >
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                  <p className="mt-1 text-sm font-bold text-card-foreground">₹{(item.offerPrice || item.price) * item.quantity}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-accent/20 px-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1"><Minus size={12} /></button>
                    <span className="min-w-[14px] text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1"><Plus size={12} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Summary */}
          <div className="mt-4 space-y-2 rounded-xl bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-card-foreground">₹{deliveryFee}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCheckout} size="lg" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Place Order · ₹{grandTotal}
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CartPage;
