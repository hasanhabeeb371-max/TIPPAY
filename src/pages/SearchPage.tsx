import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRestaurants } from "@/context/RestaurantContext";
import RestaurantCard from "@/components/RestaurantCard";
import BottomNav from "@/components/BottomNav";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "name">("rating");
  const { restaurants } = useRestaurants();

  const filtered = restaurants
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md">
        <h1 className="mb-3 font-display text-lg font-bold">Search</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food, restaurants..."
            className="bg-card pl-9"
            autoFocus
          />
        </div>
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
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {filtered.map((r, i) => (
          <RestaurantCard key={r.id} restaurant={r} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No results found for "{query}"</p>
      )}

      <BottomNav />
    </div>
  );
};

export default SearchPage;
