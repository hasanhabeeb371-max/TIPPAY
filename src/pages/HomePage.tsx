import { useMemo, useState } from "react";
import { MapPin, Search, X, Navigation, Utensils, Sparkles, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { categories, hotDeals, mockOrders } from "@/data/mockData";
import CategoryChip from "@/components/CategoryChip";
import BottomNav from "@/components/BottomNav";
import HotDealsCarousel from "@/components/HotDealsCarousel";
import { useAuth } from "@/context/AuthContext";
import { useAddress } from "@/context/AddressContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { useOrders } from "@/context/OrderContext";
import { useLocationContext } from "@/context/LocationContext";
import { useTranslation } from "@/context/LanguageContext";
import { useCravings } from "@/context/CravingsContext";
import NotificationCenter from "@/components/NotificationCenter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RestaurantCard from "@/components/RestaurantCard";
import heroBanner from "@/assets/hero-banner.jpg";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Craving Form State
  const [cravingDish, setCravingDish] = useState("");
  const [cravingDesc, setCravingDesc] = useState("");
  const [cravingPrice, setCravingPrice] = useState("");
  const [cravingTags, setCravingTags] = useState<string[]>([]);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { selectedAddress } = useAddress();
  const { restaurants } = useRestaurants();
  const { orders: liveOrders } = useOrders();
  const { userLocation, isDetecting, detectLocation } = useLocationContext();
  const { t, formatPrice } = useTranslation();
  const { addCraving } = useCravings();

  const previousOrders = useMemo(
    () =>
      [
      ...liveOrders,
      ...mockOrders.map((order) => ({
        ...order,
        restaurantId: "",
        placedAt: new Date(`${order.date} ${order.time}`),
        deliveryFee: 0,
        estimatedDelivery: "",
        paymentMethod: "",
        statusHistory: [],
      })),
      ].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime()),
    [liveOrders]
  );

  const recommendations = useMemo(() => {
    const restaurantCounts = new Map<string, number>();
    const orderedItemNames = new Set<string>();
    const orderedWords = new Set<string>();

    previousOrders.forEach((order) => {
      restaurantCounts.set(order.restaurantName, (restaurantCounts.get(order.restaurantName) || 0) + 1);
      order.items.forEach((item) => {
        const normalizedName = item.name.toLowerCase();
        orderedItemNames.add(normalizedName);
        normalizedName
          .split(/[^a-z0-9]+/)
          .filter((word) => word.length > 3)
          .forEach((word) => orderedWords.add(word));
      });
    });

    return restaurants
      .flatMap((restaurant) =>
        restaurant.menu.map((item) => {
          const itemName = item.name.toLowerCase();
          const itemCategory = item.category.toLowerCase();
          const restaurantOrderCount = restaurantCounts.get(restaurant.name) || 0;
          const exactRepeat = orderedItemNames.has(itemName);
          const categoryMatch = Array.from(orderedWords).some(
            (word) => itemName.includes(word) || itemCategory.includes(word)
          );
          const offerBoost = item.offerPrice ? 1 : 0;
          const score = restaurantOrderCount * 3 + (exactRepeat ? 5 : 0) + (categoryMatch ? 2 : 0) + offerBoost + restaurant.rating / 10;

          let reason = "Popular nearby pick";
          if (exactRepeat) reason = "You ordered this before";
          else if (restaurantOrderCount > 0) reason = `Because you ordered from ${restaurant.name}`;
          else if (categoryMatch) reason = "Matches your past cravings";
          else if (item.offerPrice) reason = "Good deal for you";

          return { restaurant, item, score, reason };
        })
      )
      .filter((rec) => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [previousOrders, restaurants]);

  const filtered = restaurants.filter((r) => {
    const matchCategory = !activeCategory || r.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleToggleTag = (tag: string) => {
    setCravingTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleBroadcastCraving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cravingDish.trim() || !cravingDesc.trim() || !cravingPrice.trim()) return;

    addCraving(
      user?.email || "demo@gmail.com",
      user?.name || "Customer Demo",
      cravingDish,
      cravingDesc,
      Number(cravingPrice),
      cravingTags
    );

    // Reset and Close
    setCravingDish("");
    setCravingDesc("");
    setCravingPrice("");
    setCravingTags([]);
    setShowCravingModal(false);
    
    // Redirect to orders/cravings tab to check state
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate("/addresses")} role="button">
            <MapPin size={18} className="text-accent" />
            <div>
              <p className="text-[10px] text-muted-foreground">{t("home.deliveringTo")}</p>
              <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                {selectedAddress ? `${selectedAddress.label} · ${selectedAddress.fullAddress.split(",")[0]}` : "Add Address"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={detectLocation} 
              disabled={isDetecting}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${userLocation ? "bg-success/10 text-success" : "bg-accent/10 text-accent hover:bg-accent/20"}`}
             >
              <Navigation size={14} className={isDetecting ? "animate-spin" : ""} />
              {isDetecting ? t("home.detecting") : userLocation ? t("home.detected") : t("home.gps")}
            </button>
            <div className="relative">
              <NotificationCenter className="bg-card text-foreground" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
            className="bg-card pl-9"
          />
        </div>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 mt-3 overflow-hidden rounded-2xl"
      >
        <div className="relative h-36">
          <img src={heroBanner} alt="Food variety" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-base font-bold text-background">
              {t("home.welcome").replace("Welcome to", "Hi")} {user?.name || "there"} 👋
            </p>
            <p className="text-xs text-background/80">{t("home.whatToEat")}</p>
          </div>
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      <div className="mx-4 mt-4">
        <Button
          onClick={() => setShowRecommendations((visible) => !visible)}
          className="flex h-12 w-full items-center justify-between rounded-xl bg-foreground px-4 text-background shadow-sm hover:bg-foreground/90"
        >
          <span className="flex items-center gap-2 text-sm font-extrabold">
            <Sparkles size={17} className="text-accent" />
            Recommended for you
          </span>
          <span className="text-[10px] font-semibold text-background/70">
            Based on previous orders
          </span>
        </Button>

        <AnimatePresence>
          {showRecommendations && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {recommendations.map(({ restaurant, item, reason }, index) => (
                  <motion.button
                    key={`${restaurant.id}-${item.id}`}
                    type="button"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => navigate(`/restaurant/${restaurant.id}?category=${encodeURIComponent(item.category)}`)}
                    className="w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-border/40 bg-card text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="flex gap-3 p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-bold uppercase tracking-wide text-accent">{reason}</p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-card-foreground">{item.name}</h3>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{restaurant.name}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Star size={10} className="fill-accent text-accent" />
                            {restaurant.rating}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {restaurant.deliveryTime}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-extrabold text-card-foreground">
                          {formatPrice(item.offerPrice ?? item.price)}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                {recommendations.length === 0 && (
                  <div className="w-full rounded-xl border border-dashed border-border/50 bg-card p-4 text-center">
                    <p className="text-sm font-semibold text-card-foreground">No recommendations yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Place an order and Tipay will learn what you like.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Request a Dish Cravings Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-card to-background p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-accent">
              <Utensils size={16} />
              <h3 className="font-display text-sm font-bold">{t("craving.bannerTitle")}</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              {t("craving.bannerDesc")}
            </p>
          </div>
          <Button
            onClick={() => setShowCravingModal(true)}
            size="sm"
            className="bg-accent text-accent-foreground font-bold hover:brightness-105"
          >
            {t("craving.button")}
          </Button>
        </div>
      </motion.div>

      {/* Hot Deals */}
      <HotDealsCarousel deals={hotDeals} />

      {/* Categories */}
      <div className="mt-5 px-4">
        <h2 className="mb-2 font-display text-sm font-semibold text-foreground">{t("home.categories")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat, i) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Restaurants */}
      <div className="mt-5 px-4">
        <h2 className="mb-3 font-display text-sm font-semibold text-foreground">
          {activeCategory ?? t("home.nearbyRestaurants")}
        </h2>
        <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground font-medium">No real-time restaurants found.</p>
            <p className="text-xs text-muted-foreground mt-1">Please add a restaurant from the Admin Panel.</p>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Cravings Modal Dialog */}
      <AnimatePresence>
        {showCravingModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-2xl border border-border/50 bg-card p-5 shadow-xl"
            >
              <button
                onClick={() => setShowCravingModal(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-1.5 text-accent mb-3">
                <Utensils size={18} />
                <h3 className="font-display text-base font-bold">Broadcast Your Craving</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Chefs nearby will view your request and send custom pricing and prep offers.
              </p>

              <form onSubmit={handleBroadcastCraving} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="c-dish" className="text-xs font-semibold">Dish Name</Label>
                  <Input
                    id="c-dish"
                    value={cravingDish}
                    onChange={(e) => setCravingDish(e.target.value)}
                    placeholder="e.g., Cheddar Stuffed Truffle Naan"
                    className="text-xs font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-desc" className="text-xs font-semibold">Specific Instructions (Chef Notes)</Label>
                  <textarea
                    id="c-desc"
                    value={cravingDesc}
                    onChange={(e) => setCravingDesc(e.target.value)}
                    placeholder="Describe how you'd like it prepared, ingredients, spice level, etc..."
                    rows={3}
                    className="w-full text-xs font-medium bg-muted/30 border border-input rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-price" className="text-xs font-semibold">Max Budget (INR)</Label>
                  <Input
                    id="c-price"
                    type="number"
                    value={cravingPrice}
                    onChange={(e) => setCravingPrice(e.target.value)}
                    placeholder="e.g., 300"
                    className="text-xs font-medium"
                    required
                  />
                </div>

                {/* Diet Chips */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold block mb-1">Tags</Label>
                  <div className="flex gap-2">
                    {["veg", "non-veg", "spicy", "sweet"].map(tag => {
                      const isActive = cravingTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-all ${
                            isActive
                              ? "bg-accent text-accent-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground font-extrabold text-xs py-2 mt-2"
                >
                  Broadcast Cravings 🚀
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
