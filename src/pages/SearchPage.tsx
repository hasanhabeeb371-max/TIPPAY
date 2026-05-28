import { useMemo, useState } from "react";
import { Search, Sparkles, Star, Clock, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

import { useRestaurants } from "@/context/RestaurantContext";
import { useOrders } from "@/context/OrderContext";
import { useTranslation } from "@/context/LanguageContext";
import { getRecommendations, matchesSearchQuery } from "@/utils/recommendations";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { restaurants } = useRestaurants();
  const { orders: liveOrders } = useOrders();
  const { t, formatPrice } = useTranslation();

  const previousOrders = useMemo(
    () =>
      [
        ...liveOrders,
      ].sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime()),
    [liveOrders]
  );

  const { food: allFood, restaurants: allRestaurants } = useMemo(
    () => getRecommendations(restaurants, previousOrders),
    [restaurants, previousOrders]
  );

  const recommendedFood = useMemo(
    () => allFood.filter((rec) => matchesSearchQuery(query, rec.restaurant, rec.item)),
    [allFood, query]
  );

  const recommendedRestaurants = useMemo(
    () => allRestaurants.filter((rec) => matchesSearchQuery(query, rec.restaurant)),
    [allRestaurants, query]
  );

  const hasResults = recommendedFood.length > 0 || recommendedRestaurants.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 border-b border-border/20 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md">
        <h1 className="mb-3 font-display text-lg font-bold">{t("search.header")}</h1>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            className="bg-card pl-9 font-medium"
            autoFocus
          />
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <div>
            <h2 className="font-display text-sm font-bold text-foreground">Recommended for you</h2>
            <p className="text-[11px] text-muted-foreground">Based on your previous orders & history</p>
          </div>
        </div>

        {!hasResults && (
          <p className="py-12 text-center text-muted-foreground">
            {query ? `${t("search.noResults")} "${query}"` : "Place an order and we'll personalize picks for you."}
          </p>
        )}

        {recommendedRestaurants.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Store size={14} />
              Restaurants
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {recommendedRestaurants.map(({ restaurant, reason }, index) => (
                <motion.button
                  key={restaurant.id}
                  type="button"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="w-[200px] flex-shrink-0 overflow-hidden rounded-xl border border-border/40 bg-card text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="truncate text-[10px] font-bold uppercase tracking-wide text-accent">{reason}</p>
                    <h4 className="mt-1 truncate font-display text-sm font-bold text-card-foreground">
                      {restaurant.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{restaurant.category}</p>
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
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {recommendedFood.length > 0 && (
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Food items
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
              {recommendedFood.map(({ restaurant, item, reason }, index) => (
                <motion.button
                  key={`${restaurant.id}-${item.id}`}
                  type="button"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() =>
                    navigate(`/restaurant/${restaurant.id}?category=${encodeURIComponent(item.category)}`)
                  }
                  className="w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-border/40 bg-card text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
                >
                  <div className="flex gap-3 p-3">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold uppercase tracking-wide text-accent">{reason}</p>
                      <h4 className="mt-1 line-clamp-2 text-sm font-bold text-card-foreground">{item.name}</h4>
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
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
