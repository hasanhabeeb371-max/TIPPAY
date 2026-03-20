import { useState } from "react";
import { MapPin, Bell, Search, X, ChevronRight, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { categories, hotDeals } from "@/data/mockData";
import CategoryChip from "@/components/CategoryChip";
import { Star } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import HotDealsCarousel from "@/components/HotDealsCarousel";
import { useAuth } from "@/context/AuthContext";
import { useAddress } from "@/context/AddressContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { useLocationContext } from "@/context/LocationContext";
import NotificationCenter from "@/components/NotificationCenter";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { selectedAddress } = useAddress();
  const { restaurants } = useRestaurants();
  const { userLocation, isDetecting, detectLocation } = useLocationContext();

  const filtered = restaurants.filter((r) => {
    const matchCategory = !activeCategory || r.category === activeCategory;
    const matchSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const visibleCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate("/addresses")} role="button">
            <MapPin size={18} className="text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Delivering to</p>
              <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">
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
              {isDetecting ? "Detecting..." : userLocation ? "Detected" : "GPS"}
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
            placeholder="Search restaurants, cuisines..."
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
        <div className="relative h-40">
          <img src={heroBanner} alt="Food variety" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-lg font-bold text-background">
              Hi {user?.name || "there"} 👋
            </p>
            <p className="text-sm text-background/80">What would you like to eat?</p>
          </div>
        </div>
      </motion.div>

      {/* Hot Deals */}
      <HotDealsCarousel deals={hotDeals} />

      {/* Categories */}
      <div className="mt-5 px-4">
        <h2 className="mb-3 font-display text-base font-semibold text-foreground">Categories</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {visibleCategories.map((cat, i) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              index={i}
            />
          ))}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowAllCategories(true)}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 bg-card hover:bg-card/80 flex-shrink-0"
            style={{ minWidth: 72, minHeight: 84 }}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
              <ChevronRight size={24} className="text-accent" />
            </div>
            <span className="text-[10px] font-medium leading-tight text-accent text-center">
              See All
            </span>
          </motion.button>
        </div>
      </div>

      {/* Restaurants */}
      <div className="mt-5 px-4">
        <h2 className="mb-3 font-display text-base font-semibold text-foreground">
          {activeCategory ? activeCategory : "Nearby Restaurants"}
        </h2>
        <div className="flex flex-col gap-6 pb-6">
          {filtered.map((r) => (
            <div key={r.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between" onClick={() => navigate(`/restaurant/${r.id}`)}>
                <div>
                  <h3 className="font-display text-lg font-bold text-card-foreground">{r.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-card-foreground"><Star size={12} className="fill-accent text-accent" /> {r.rating}</span>
                    <span>•</span>
                    <span>{r.deliveryTime}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x mt-1">
                {r.menu.length > 0 ? (
                  r.menu.map((item) => (
                    <div key={item.id} className="min-w-[140px] snap-start rounded-xl bg-card border border-border/50 overflow-hidden shadow-sm flex flex-col cursor-pointer" onClick={() => navigate(`/restaurant/${r.id}`)}>
                      <div className="h-28 w-full bg-muted">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted"><span className="text-xs">No Image</span></div>
                        )}
                      </div>
                      <div className="p-2.5 flex-1 flex flex-col justify-between">
                        <p className="font-semibold text-xs leading-tight line-clamp-2">{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="font-bold text-sm text-foreground">₹{item.offerPrice || item.price}</span>
                          {item.offerPrice && <span className="text-[10px] text-muted-foreground line-through">₹{item.price}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground border-l-2 border-border pl-2 my-2">No menu available</p>
                )}
              </div>
            </div>
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

      {/* All Categories Popup Modal */}
      {showAllCategories && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-4 backdrop-blur-md">
            <h2 className="text-xl font-bold">All Categories</h2>
            <button
              onClick={() => setShowAllCategories(false)}
              className="rounded-full bg-card p-2 text-foreground shadow-sm hover:bg-muted"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-6">
              {categories.map((cat, i) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  isActive={activeCategory === cat.name}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat.name ? null : cat.name);
                    setShowAllCategories(false);
                  }}
                  index={i}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
