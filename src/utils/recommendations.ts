import type { Restaurant } from "@/data/mockData";
import type { LiveOrder } from "@/context/OrderContext";

export interface RecommendedFood {
  restaurant: Restaurant;
  item: Restaurant["menu"][number];
  score: number;
  reason: string;
}

export interface RecommendedRestaurant {
  restaurant: Restaurant;
  score: number;
  reason: string;
}

export function getRecommendations(
  restaurants: Restaurant[],
  previousOrders: LiveOrder[]
): { food: RecommendedFood[]; restaurants: RecommendedRestaurant[] } {
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

  const food = restaurants
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
        const score =
          restaurantOrderCount * 3 + (exactRepeat ? 5 : 0) + (categoryMatch ? 2 : 0) + offerBoost + restaurant.rating / 10;

        let reason = "Popular nearby pick";
        if (exactRepeat) reason = "You ordered this before";
        else if (restaurantOrderCount > 0) reason = `Because you ordered from ${restaurant.name}`;
        else if (categoryMatch) reason = "Matches your past cravings";
        else if (item.offerPrice) reason = "Good deal for you";

        return { restaurant, item, score, reason };
      })
    )
    .filter((rec) => rec.score > 0)
    .sort((a, b) => b.score - a.score);

  const restaurantMap = new Map<string, RecommendedRestaurant>();

  restaurants.forEach((restaurant) => {
    const orderCount = restaurantCounts.get(restaurant.name) || 0;
    if (orderCount > 0) {
      restaurantMap.set(restaurant.id, {
        restaurant,
        score: orderCount * 5 + restaurant.rating,
        reason: `You've ordered from ${restaurant.name} before`,
      });
    }
  });

  food.slice(0, 12).forEach((rec) => {
    const existing = restaurantMap.get(rec.restaurant.id);
    if (existing) {
      existing.score += rec.score;
    } else if (rec.score >= 2) {
      restaurantMap.set(rec.restaurant.id, {
        restaurant: rec.restaurant,
        score: rec.score,
        reason: rec.reason,
      });
    }
  });

  let recommendedRestaurants = Array.from(restaurantMap.values()).sort((a, b) => b.score - a.score);

  if (recommendedRestaurants.length === 0) {
    recommendedRestaurants = [...restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
      .map((restaurant) => ({
        restaurant,
        score: restaurant.rating,
        reason: "Popular nearby pick",
      }));
  }

  return {
    food: food.slice(0, 8),
    restaurants: recommendedRestaurants.slice(0, 6),
  };
}

export function matchesSearchQuery(
  query: string,
  restaurant: Restaurant,
  item?: Restaurant["menu"][number]
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  if (restaurant.name.toLowerCase().includes(q)) return true;
  if (restaurant.category.toLowerCase().includes(q)) return true;
  if (item) {
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }
  return restaurant.menu.some(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  );
}
