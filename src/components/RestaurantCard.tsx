import { useState, useMemo } from "react";
import { Star, Clock, MapPin, UtensilsCrossed, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Restaurant } from "@/types/models";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  restaurant: Restaurant;
  index?: number;
}

const RestaurantCard = ({ restaurant, index = 0 }: Props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuCategories = useMemo(
    () => [...new Set(restaurant.menu.map((m) => m.category))],
    [restaurant.menu]
  );

  const goToRestaurant = () => navigate(`/restaurant/${restaurant.id}`);

  const goToCategory = (category: string) => {
    navigate(`/restaurant/${restaurant.id}?category=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={goToRestaurant}
        onKeyDown={(e) => e.key === "Enter" && goToRestaurant()}
        className="relative h-36 cursor-pointer overflow-hidden"
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground">
              Closed
            </span>
          </div>
        )}
        {restaurant.menu.some((m) => m.offerPrice) && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            OFFER
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToRestaurant();
          }}
          className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-bold text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Store size={12} className="text-accent" />
          Restaurant
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={goToRestaurant}
        onKeyDown={(e) => e.key === "Enter" && goToRestaurant()}
        className="cursor-pointer p-3 pb-0"
      >
        <h3 className="font-display text-base font-semibold text-card-foreground">{restaurant.name}</h3>
        <p className="text-xs text-muted-foreground">{restaurant.category}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-accent text-accent" />
            <span className="font-medium text-card-foreground">{restaurant.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {restaurant.distance}
          </span>
        </div>
      </div>

      <div className="border-t border-border/50 p-3 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          className="flex w-full items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-left transition-colors hover:bg-muted"
        >
          <UtensilsCrossed size={16} className="text-accent" />
          <span className="text-sm font-bold text-card-foreground">Menu</span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                role="group"
                aria-label="Menu categories"
                className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
              >
                {menuCategories.length === 0 ? (
                  <p className="w-full py-2 text-center text-xs text-muted-foreground">No menu categories yet</p>
                ) : (
                  menuCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToCategory(cat);
                      }}
                      className="flex-shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {cat}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
