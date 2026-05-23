import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag, X, CheckCircle2, Wallet, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { mockCoupons, Coupon } from "@/data/mockData";
import { toast } from "sonner";
import { useTranslation } from "@/context/LanguageContext";
import BottomNav from "@/components/BottomNav";

const GPayIcon = ({ size = 24, ...props }: any) => (
  <svg viewBox="0 0 120 120" width={size} height={size} {...props}>
    <rect width="120" height="120" rx="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
    <g transform="translate(36, 36)">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.13 30.52 0 24 0 14.78 0 6.73 5.38 2.59 13.25l7.98 6.19C12.59 13.58 17.84 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.52c0-1.63-.16-3.2-.45-4.74H24v9.06h12.98c-.59 3.09-2.28 5.71-4.8 7.42l7.74 6c4.54-4.18 7.06-10.35 7.06-17.74z"/>
      <path fill="#FBBC05" d="M10.57 28.5c-1.03-3.05-1.03-6.38 0-9.43l-7.98-6.19c-3.46 6.91-3.46 15.11 0 22.02l7.98-6.4z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.77l-7.74-6c-2.15 1.44-4.91 2.27-8.15 2.27-6.16 0-11.41-4.08-13.43-9.94l-7.98 6.4C6.73 42.62 14.78 48 24 48z"/>
    </g>
  </svg>
);

const PhonePeIcon = ({ size = 24, ...props }: any) => (
  <svg viewBox="0 0 120 120" width={size} height={size} {...props}>
    <rect width="120" height="120" rx="24" fill="#5f259f" />
    <text x="60" y="82" fontFamily="sans-serif" fontSize="72" fontWeight="bold" fill="#ffffff" textAnchor="middle">पे</text>
  </svg>
);

const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", icon: Banknote },
  { id: "gpay", name: "Google Pay", icon: GPayIcon },
  { id: "phonepe", name: "PhonePe", icon: PhonePeIcon },
  { id: "upi", name: "UPI", icon: CreditCard },
];

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { placeOrder } = useOrders();
  const { formatPrice } = useTranslation();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Coupon | null>(null);
  const [promoError, setPromoError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [upiId, setUpiId] = useState("");

  const deliveryFee = items.length > 0 ? 30 : 0;

  const discount = (() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === "fixed") return appliedPromo.discount;
    const raw = (totalPrice * appliedPromo.discount) / 100;
    return raw;
  })();

  const codFee = paymentMethod === "Cash on Delivery" ? 30 : 0;

  const grandTotal = Math.max(0, totalPrice - discount + deliveryFee + codFee);

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a coupon code");
      return;
    }
    if (code.length > 20) {
      setPromoError("Invalid coupon code");
      return;
    }
    const promo = mockCoupons.find((p) => p.code === code);
    if (!promo) {
      setPromoError("Invalid coupon code");
      return;
    }
    if (!promo.isActive) {
      setPromoError("This coupon is currently inactive");
      return;
    }
    if (new Date(promo.validUntil) < new Date()) {
      setPromoError("This coupon has expired");
      return;
    }
    if (totalPrice < promo.minOrderValue) {
      setPromoError(`Minimum order ${formatPrice(promo.minOrderValue)} required`);
      return;
    }
    setAppliedPromo(promo);
    setPromoInput("");
    toast.success(`Coupon "${promo.code}" applied!`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (paymentMethod === "UPI" && !upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

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
      discount: discount > 0 ? discount : undefined,
      estimatedDelivery: "25-35 min",
      paymentMethod,
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
                  <p className="mt-1 text-sm font-bold text-card-foreground">{formatPrice((item.offerPrice || item.price) * item.quantity)}</p>
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

          {/* Coupon Code Section */}
          <div className="mt-4 rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
              <Tag size={14} className="text-accent" />
              Coupon Code
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
                      <p className="text-[10px] text-muted-foreground">
                        {appliedPromo.type === "percentage" ? `${appliedPromo.discount}% off` : `${formatPrice(appliedPromo.discount)} off`} · Saving {formatPrice(Math.round(discount))}
                      </p>
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
                    {mockCoupons.filter(c => c.isActive).slice(0, 3).map((p) => (
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

          {/* Payment Method */}
          <div className="mt-4 rounded-xl bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Payment Method</h3>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.name;
                return (
                  <div key={method.id} className="w-full">
                    <button
                      onClick={() => setPaymentMethod(method.name)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        isSelected ? "border-accent bg-accent/5" : "border-border bg-background hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={18} className={isSelected ? "text-accent" : "text-muted-foreground"} />
                      <div className="flex flex-1 flex-col">
                        <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                          {method.name}
                        </span>
                        {method.id === "cod" && (
                          <span className="text-[10px] text-muted-foreground">
                            + {formatPrice(30)} extra charge
                          </span>
                        )}
                      </div>
                      {isSelected && <CheckCircle2 size={16} className="ml-auto text-accent" />}
                    </button>
                    {isSelected && method.id === "upi" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        className="overflow-hidden"
                      >
                        <Input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your UPI ID (e.g., name@okbank)"
                          className="h-10 text-sm bg-background border-border/60 focus-visible:ring-accent"
                        />
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 space-y-2 rounded-xl bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex justify-between text-sm"
              >
                <span className="text-success">Discount</span>
                <span className="font-medium text-success">-{formatPrice(Math.round(discount))}</span>
              </motion.div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="text-card-foreground">{formatPrice(deliveryFee)}</span>
            </div>
            {codFee > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">COD Charge</span>
                <span className="text-card-foreground">{formatPrice(codFee)}</span>
              </motion.div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(Math.round(grandTotal))}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleCheckout} size="lg" className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Place Order · {formatPrice(Math.round(grandTotal))}
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CartPage;
