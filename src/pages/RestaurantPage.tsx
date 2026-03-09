import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewContext";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, Leaf, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, updateQuantity, totalItems, totalPrice } = useCart();
  const { getReviewsForRestaurant } = useReviews();
  const restaurant = restaurants.find((r) => r.id === id);
  const restaurantReviews = restaurant ? getReviewsForRestaurant(restaurant.id) : [];

  if (!restaurant) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Restaurant not found</div>;
  }

  const menuCategories = [...new Set(restaurant.menu.map((m) => m.category))];

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleBuyNow = (item: typeof restaurant.menu[0]) => {
    const qty = getItemQuantity(item.id);
    if (qty === 0) {
      addItem(item, restaurant.id, restaurant.name);
    }
    toast.success(`Proceeding to checkout with ${item.name}!`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Banner */}
      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-4 left-4">
          <h1 className="font-display text-2xl font-bold text-background">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-background/80">
            <span className="flex items-center gap-1"><Star size={12} className="fill-accent text-accent" />{restaurant.rating}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{restaurant.distance}</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {restaurantReviews.length > 0 && (
        <div className="px-4 pt-4">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Reviews ({restaurantReviews.length})
          </h2>
          <div className="space-y-2">
            {restaurantReviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="rounded-xl bg-card p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} className={s <= rev.foodRating ? "fill-accent text-accent" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {rev.createdAt.toLocaleDateString()}
                  </span>
                </div>
                {rev.comment && (
                  <p className="mt-1 text-xs text-muted-foreground italic">"{rev.comment}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="px-4 pt-4">
        {menuCategories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
            <div className="space-y-3">
              {restaurant.menu
                .filter((m) => m.category === cat)
                .map((item, i) => {
                  const qty = getItemQuantity(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 rounded-xl bg-card p-3"
                    >
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            {item.isVeg && <Leaf size={12} className="text-success" />}
                            <h3 className="text-sm font-semibold text-card-foreground">{item.name}</h3>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <div className="mt-1.5 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-card-foreground">₹{item.offerPrice || item.price}</span>
                            {item.offerPrice && (
                              <span className="text-xs text-muted-foreground line-through">₹{item.price}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {qty === 0 ? (
                              <>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    addItem(item, restaurant.id, restaurant.name);
                                    toast.success(`${item.name} added to cart`);
                                  }}
                                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-md transition-all hover:shadow-lg hover:brightness-105 active:shadow-sm"
                                >
                                  <ShoppingCart size={12} />
                                  ADD
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleBuyNow(item)}
                                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 active:shadow-sm"
                                >
                                  <Zap size={12} />
                                  BUY NOW
                                </motion.button>
                              </>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-1.5 shadow-sm">
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQuantity(item.id, qty - 1)}
                                    className="rounded-full p-1 text-accent-foreground transition-colors hover:bg-accent/30"
                                  >
                                    <Minus size={14} />
                                  </motion.button>
                                  <motion.span
                                    key={qty}
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    className="min-w-[16px] text-center text-sm font-bold text-accent-foreground"
                                  >
                                    {qty}
                                  </motion.span>
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => addItem(item, restaurant.id, restaurant.name)}
                                    className="rounded-full p-1 text-accent-foreground transition-colors hover:bg-accent/30"
                                  >
                                    <Plus size={14} />
                                  </motion.button>
                                </div>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate("/cart")}
                                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
                                >
                                  <Zap size={12} />
                                  BUY NOW
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-16 left-0 right-0 z-50 px-4 pb-2"
          >
            <button
              onClick={() => navigate("/cart")}
              className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-3.5 shadow-xl transition-all hover:brightness-110"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <ShoppingCart size={16} className="text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-primary-foreground/70">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                  <p className="text-sm font-bold text-primary-foreground">₹{totalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-primary-foreground">
                View Cart
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default RestaurantPage;
