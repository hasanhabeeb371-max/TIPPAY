import { useState } from "react";
import { Search, SlidersHorizontal, Sparkles, BrainCircuit, ShoppingCart, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRestaurants } from "@/context/RestaurantContext";
import { useTranslation } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { performAISearch } from "@/utils/aiSearch";
import RestaurantCard from "@/components/RestaurantCard";
import BottomNav from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating");
  const [searchMode, setSearchMode] = useState<"standard" | "ai">("standard");
  const { restaurants, menuItems } = useRestaurants();
  const { t, formatPrice } = useTranslation();
  const { addItem, getItemQuantity } = useCart() as any; // Cast in case getItemQuantity is not defined in type
  const { items: cartItems, updateQuantity } = useCart();

  const getQty = (itemId: string) => {
    return cartItems.find((i) => i.id === itemId)?.quantity || 0;
  };

  // Standard search
  const filteredRestaurants = restaurants
    .filter((r) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.menu.some((m) => m.name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      return a.name.localeCompare(b.name);
    });

  // AI search results
  const aiResults = performAISearch(query, restaurants, menuItems);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header & Controls */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md border-b border-border/20">
        <h1 className="mb-3 font-display text-lg font-bold">{t("search.header")}</h1>
        
        {/* Search Mode Selector */}
        <div className="mb-3 flex gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setSearchMode("standard")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
              searchMode === "standard" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal size={13} />
            {t("search.standard")}
          </button>
          <button
            onClick={() => setSearchMode("ai")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
              searchMode === "ai"
                ? "bg-accent/20 text-accent border border-accent/20 shadow-sm"
                : "text-muted-foreground hover:text-accent"
            }`}
          >
            <Sparkles size={13} className="text-accent" />
            {t("search.aiSmartSearch")}
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === "ai"
                ? "e.g., something spicy with chicken under 300"
                : t("home.searchPlaceholder")
            }
            className="bg-card pl-9 font-medium"
            autoFocus
          />
          {searchMode === "ai" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <BrainCircuit size={16} className="text-accent animate-pulse" />
            </div>
          )}
        </div>

        {/* Standard filters */}
        {searchMode === "standard" && (
          <div className="mt-3 flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-muted-foreground" />
            {(["rating", "distance", "name"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  sortBy === s ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="px-4 pt-4">
        {searchMode === "standard" ? (
          /* Standard results */
          <div className="grid grid-cols-2 gap-3">
            {filteredRestaurants.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
            {filteredRestaurants.length === 0 && (
              <p className="col-span-2 py-12 text-center text-muted-foreground">
                {t("search.noResults")} "{query}"
              </p>
            )}
          </div>
        ) : (
          /* AI Smart Search results */
          <div className="space-y-4">
            {query.trim() === "" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Sparkles size={40} className="text-accent/60 mb-3" />
                <p className="font-display text-sm font-bold text-foreground">Try AI Smart Search!</p>
                <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                  Describe what you want in plain words: e.g. "vegan healthy salad" or "sweet chocolate cake"
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 text-xs font-medium text-accent">
                  <BrainCircuit size={12} />
                  <span>AI Recommendations ({aiResults.length} matches found)</span>
                </div>
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {aiResults.map((res, i) => {
                      const qty = getQty(res.item.id);
                      return (
                        <motion.div
                          key={res.item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex flex-col rounded-2xl bg-card border border-border/40 p-4 shadow-sm"
                        >
                          <div className="flex gap-3">
                            <img
                              src={res.item.image}
                              alt={res.item.name}
                              className="h-20 w-20 rounded-xl object-cover bg-muted shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                {res.item.isVeg && <Leaf size={11} className="text-success shrink-0" />}
                                <h3 className="text-sm font-semibold truncate text-foreground">{res.item.name}</h3>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                from <span className="font-medium text-accent-foreground">{res.restaurantName}</span>
                              </p>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-tight">
                                {res.item.description}
                              </p>
                            </div>
                          </div>

                          {/* AI Match Metrics */}
                          <div className="mt-3 border-t border-border/20 pt-3">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1">
                              <span>Match Score</span>
                              <span className="text-accent">{res.score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent transition-all duration-500"
                                style={{ width: `${res.score}%` }}
                              />
                            </div>
                            
                            {/* Reasons Chips */}
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {res.reasons.map((r, ri) => (
                                <span
                                  key={ri}
                                  className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent-foreground"
                                >
                                  ✨ {r}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Pricing & Cart Action */}
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">
                              {formatPrice(res.item.offerPrice || res.item.price)}
                            </span>
                            
                            {qty === 0 ? (
                              <button
                                onClick={() => {
                                  addItem(res.item, res.restaurantId, res.restaurantName);
                                  toast.success(`Added ${res.item.name} to cart!`);
                                }}
                                className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground hover:brightness-105"
                              >
                                <ShoppingCart size={11} />
                                ADD
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-2 py-1">
                                <button
                                  onClick={() => updateQuantity(res.item.id, qty - 1)}
                                  className="text-xs font-bold text-accent-foreground px-1"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold text-accent-foreground">{qty}</span>
                                <button
                                  onClick={() => updateQuantity(res.item.id, qty + 1)}
                                  className="text-xs font-bold text-accent-foreground px-1"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {aiResults.length === 0 && (
                    <p className="py-12 text-center text-muted-foreground text-xs">
                      No matching dishes found for "{query}". Try checking dietary terms or price constraints.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
