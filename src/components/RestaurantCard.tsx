import { Star, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Restaurant } from "@/data/mockData";
import { motion } from "framer-motion";

interface Props {
  restaurant: Restaurant;
  index?: number;
}

const RestaurantCard = ({ restaurant, index = 0 }: Props) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground">
              Closed
            </span>
          </div>
        )}
        {restaurant.menu.some((m) => m.offerPrice) && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            OFFER
          </span>
        )}
      </div>
      <div className="p-3">
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
    </motion.div>
  );
};

export default RestaurantCard;
