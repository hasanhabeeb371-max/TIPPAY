import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface PromoCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  label: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME50", type: "percent", value: 50, minOrder: 200, maxDiscount: 150, label: "50% off up to ₹150" },
  { code: "FLAT100", type: "flat", value: 100, minOrder: 300, label: "₹100 off on orders above ₹300" },
  { code: "TIPFIRST", type: "percent", value: 30, minOrder: 150, maxDiscount: 100, label: "30% off up to ₹100" },
  { code: "SAVE25", type: "percent", value: 25, minOrder: 250, maxDiscount: 200, label: "25% off up to ₹200" },
];

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");

  const deliveryFee = items.length > 0 ? 30 : 0;

  const discount = (() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "flat") return appliedPromo.value;
    const raw = (totalPrice * appliedPromo.value) / 100;
    return appliedPromo.maxDiscount ? Math.min(raw, appliedPromo.maxDiscount) : raw;
  })();

  const grandTotal = Math.max(0, totalPrice - discount + deliveryFee);

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }
    if (code.length > 20) {
      setPromoError("Invalid promo code");
      return;
    }
    const promo = PROMO_CODES.find((p) => p.code === code);
    if (!promo) {
      setPromoError("Invalid promo code");
      return;
    }
    if (totalPrice < promo.minOrder) {
      setPromoError(`Minimum order ₹${promo.minOrder} required`);
      return;
    }
    setAppliedPromo(promo);
    setPromoInput("");
    toast.success(`Promo "${promo.code}" applied!`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

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
    setAppliedPromo(null);
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
          <button onClick={() => { clearCart(); setAppliedPromo(null); }} className="ml-auto text-xs text-destructive">Clear All</button>
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

          {/* Promo Code Section */}
          <div className="mt-4 rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Tag size={14} className="text-accent" />
              Promo Code
            </div>

            <AnimatePresence mode="wait">
              {appliedPromo ? (
                <motion.div
                  key="applied"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-3 flex items-center justify-between rounded-lg bg-accent/15 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <div>
                      <p className="text-xs font-bold text-card-foreground">{appliedPromo.code}</p>
                      <p className="text-[10px] text-muted-foreground">{appliedPromo.label} · Saving ₹{Math.round(discount)}</p>
                    </div>
                  </div>
                  <button onClick={handleRemovePromo} className="rounded-full p-1 text-muted-foreground hover:text-destructive">
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-3"
                >
                  <div className="flex gap-2">
                    <Input
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase().slice(0, 20));
                        setPromoError("");
                      }}
                      placeholder="Enter code"
                      className="h-9 flex-1 bg-background text-xs uppercase"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      size="sm"
                      className="h-9 bg-accent px-4 text-xs font-bold text-accent-foreground hover:bg-accent/90"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1.5 text-xs text-destructive"
                    >
                      {promoError}
                    </motion.p>
                  )}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {PROMO_CODES.slice(0, 3).map((p) => (
                      <button
                        key={p.code}
                        onClick={() => { setPromoInput(p.code); setPromoError(""); }}
                        className="rounded-full border border-dashed border-accent/50 px-2.5 py-1 text-[10px] font-medium text-accent-foreground transition-colors hover:bg-accent/10"
                      >
                        {p.code}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="mt-4 space-y-2 rounded-xl bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">₹{totalPrice}</span>
            </div>
            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex justify-between text-sm"
              >
                <span className="text-success">Discount</span>
                <span className="font-medium text-success">-₹{Math.round(discount)}</span>
              </motion.div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-card-foreground">₹{deliveryFee}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{Math.round(grandTotal)}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCheckout} size="lg" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Place Order · ₹{Math.round(grandTotal)}
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CartPage;
