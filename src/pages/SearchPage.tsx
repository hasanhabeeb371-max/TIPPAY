import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRestaurants } from "@/context/RestaurantContext";
import { useTranslation } from "@/context/LanguageContext";
import RestaurantCard from "@/components/RestaurantCard";
import BottomNav from "@/components/BottomNav";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating");
  const { restaurants } = useRestaurants();
  const { t } = useTranslation();

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      if (!query) return true;
      const normalizedQuery = query.toLowerCase();
      return (
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.category.toLowerCase().includes(normalizedQuery) ||
        restaurant.menu.some((item) => item.name.toLowerCase().includes(normalizedQuery))
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      return a.name.localeCompare(b.name);
    });

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

        <div className="mt-3 flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
          {(["rating", "distance", "name"] as const).map((sortOption) => (
            <button
              key={sortOption}
              onClick={() => setSortBy(sortOption)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === sortOption ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"
              }`}
            >
              {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
          {filteredRestaurants.length === 0 && (
            <p className="col-span-2 py-12 text-center text-muted-foreground">
              {t("search.noResults")} "{query}"
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SearchPage;
