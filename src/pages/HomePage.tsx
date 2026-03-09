import { useState } from "react";
import { MapPin, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories, restaurants } from "@/data/mockData";
import CategoryChip from "@/components/CategoryChip";
import RestaurantCard from "@/components/RestaurantCard";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";
import { useAddress } from "@/context/AddressContext";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const filtered = restaurants.filter((r) => {
    const matchCategory = !activeCategory || r.category === activeCategory;
    const matchSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-2 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Delivering to</p>
              <p className="text-sm font-semibold text-foreground">Current Location</p>
            </div>
          </div>
          <button className="relative rounded-full bg-card p-2">
            <Bell size={18} className="text-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
          </button>
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

      {/* Categories */}
      <div className="mt-5 px-4">
        <h2 className="mb-3 font-display text-base font-semibold text-foreground">Categories</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
        <h2 className="mb-3 font-display text-base font-semibold text-foreground">
          {activeCategory ? activeCategory : "Nearby Restaurants"}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No restaurants found</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
