import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRestaurants } from "@/context/RestaurantContext";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewContext";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, Leaf, ShoppingCart, Zap, Heart, Tag, Gift } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useTranslation } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, updateQuantity, totalItems, totalPrice } = useCart();
  const { getReviewsForRestaurant } = useReviews();
  const { restaurants } = useRestaurants();
  const { toggleFoodFavorite, isFoodFavorite } = useFavorites();
  const { formatPrice } = useTranslation();

  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const restaurant = restaurants.find((r) => r.id === id);
  const restaurantReviews = restaurant ? getReviewsForRestaurant(restaurant.id) : [];

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const offerCards = restaurant ? [
    { id: 1, text: "20% off on orders above ₹299", badge: "20%", gradient: "from-orange-500 to-amber-400", code: "SAVE20" },
    { id: 2, text: "Free delivery today only!", badge: "FREE", gradient: "from-emerald-500 to-teal-400", code: "FREEDEL" },
    { id: 3, text: "Use code WELCOME50 for 50% off first order", badge: "50%", gradient: "from-purple-500 to-fuchsia-400", code: "WELCOME50" },
  ] : [];

  const menuCategories = restaurant ? [...new Set(restaurant.menu.map((m) => m.category))] : [];

  const totalItemCount = restaurant ? restaurant.menu.length : 0;

  const displayedCategories = activeCategory
    ? menuCategories.filter(cat => cat === activeCategory)
    : menuCategories;

  if (!restaurant && !showSplash) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Restaurant not found</div>;
  }

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleBuyNow = (item: NonNullable<typeof restaurant>['menu'][0]) => {
    const qty = getItemQuantity(item.id);
    if (qty === 0) {
      addItem(item, restaurant.id, restaurant.name);
    }
    toast.success(`Proceeding to checkout with ${item.name}!`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {restaurant ? (
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
            </motion.div>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-6 text-center">
              {/* Logo / Image */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mb-5 h-28 w-28 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20"
              >
                {restaurant ? (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10 backdrop-blur-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                )}
              </motion.div>

              {/* Restaurant Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="font-display text-3xl font-bold text-white drop-shadow-lg"
              >
                {restaurant?.name ?? "Loading..."}
              </motion.h1>

              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                className="mt-3"
              >
                {restaurant && (
                  <>
                    <span className="inline-flex items-center rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md backdrop-blur-sm">
                      {restaurant.category}
                    </span>
                    {!restaurant.isOpen && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-destructive/90 px-3 py-1 text-xs font-semibold text-destructive-foreground shadow-md backdrop-blur-sm">
                        Closed
                      </span>
                    )}
                  </>
                )}
              </motion.div>

              {/* Info Row */}
              {restaurant && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="mt-4 flex items-center gap-4 text-sm text-white/90"
                >
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {restaurant.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {restaurant.deliveryTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {restaurant.distance}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Bottom Loader */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center px-10"
            >
              <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, delay: 1.2, ease: "linear" }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="mt-3 text-xs font-medium tracking-wide text-white/70"
              >
                Opening menu...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner */}
      {restaurant && (<>
      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform hover:scale-105"
        >
          <ArrowLeft size={18} className="text-foreground" />
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

      {/* Restaurant Offers */}
      <div className="px-4 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-sm font-semibold text-foreground">
            🔥 Restaurant Offers
          </h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
          {offerCards.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className={`relative min-w-[240px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${offer.gradient} p-4 shadow-lg`}
            >
              <span className="absolute right-2 top-2 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-sm">
                {offer.badge}
              </span>
              <div className="flex flex-col justify-between h-full gap-3">
                <div className="flex items-start gap-2">
                  <Tag size={16} className="mt-0.5 flex-shrink-0 text-white/80" />
                  <p className="text-sm font-bold leading-snug text-white">{offer.text}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {offer.code}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(offer.code);
                      toast.success(`Code ${offer.code} copied!`);
                    }}
                    className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-gray-900 shadow-md transition-transform hover:scale-105 active:scale-95"
                  >
                    <Gift size={10} className="mr-1 inline" />Grab
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories — Sticky Index Bar */}
      {menuCategories.length > 0 && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border py-3 px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Categories
          </p>
          <div
            className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
          >
            {/* All chip */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 w-auto px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                activeCategory === null
                  ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                  : 'bg-muted text-muted-foreground opacity-80 hover:opacity-100'
              }`}
            >
              <span className="font-medium text-sm">All</span>
              <span className="inline-flex items-center justify-center rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {totalItemCount}
              </span>
            </motion.button>

            {menuCategories.map((cat) => {
              const itemCount = restaurant!.menu.filter((m) => m.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`flex-shrink-0 w-auto px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                      : 'bg-muted text-muted-foreground opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="font-medium text-sm">{cat}</span>
                  <span className="inline-flex items-center justify-center rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {itemCount}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory ?? 'all'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {displayedCategories.map((cat) => {
              const catItemCount = restaurant!.menu.filter((m) => m.category === cat).length;
              return (
                <div key={cat} id={`category-${cat.replace(/\s+/g, '-').toLowerCase()}`} className="mb-6">
                  <div className={`mb-3 ${activeCategory ? 'border-l-4 border-accent pl-3' : ''}`}>
                    <h2 className={`font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground ${activeCategory ? 'text-lg font-bold normal-case tracking-normal text-card-foreground' : ''}`}>
                      {cat}{activeCategory ? <span className="ml-2 text-sm font-normal text-muted-foreground">· {catItemCount} item{catItemCount !== 1 ? 's' : ''}</span> : null}
                    </h2>
                  </div>
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
                            className="group flex gap-3 rounded-xl bg-card p-3 relative"
                          >
                            <div className="relative h-24 w-24 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFoodFavorite(item.id);
                                }}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform hover:scale-110 shadow-sm"
                              >
                                <Heart size={12} className={isFoodFavorite(item.id) ? "fill-accent text-accent" : "text-foreground"} />
                              </button>
                            </div>
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
                                  <span className="text-sm font-bold text-card-foreground">{formatPrice(item.offerPrice || item.price)}</span>
                                  {item.offerPrice && (
                                    <span className="text-xs text-muted-foreground line-through">{formatPrice(item.price)}</span>
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
              );
            })}
          </motion.div>
        </AnimatePresence>
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
                  <p className="text-sm font-bold text-primary-foreground">{formatPrice(totalPrice)}</p>
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
      </>)}
    </div>
  );
};

export default RestaurantPage;
