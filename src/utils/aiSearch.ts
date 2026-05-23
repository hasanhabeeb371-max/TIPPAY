import type { MenuItem } from "@/data/mockData";

export interface AISearchResult {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  score: number; // 0 to 100
  reasons: string[];
}

export function performAISearch(
  query: string,
  restaurants: any[],
  menuItems: any[]
): AISearchResult[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  // Extract dietary filters
  const wantsVeg = tokens.includes("veg") || tokens.includes("vegetarian") || tokens.includes("healthy");
  const wantsNonVeg = tokens.includes("non-veg") || tokens.includes("nonveg") || tokens.includes("chicken") || tokens.includes("meat") || tokens.includes("mutton") || tokens.includes("fish");
  const wantsSweet = tokens.includes("sweet") || tokens.includes("dessert") || tokens.includes("chocolate") || tokens.includes("cake") || tokens.includes("icecream") || tokens.includes("shake");
  const wantsSpicy = tokens.includes("spicy") || tokens.includes("hot") || tokens.includes("tikka") || tokens.includes("chilli") || tokens.includes("masala");
  const wantsCheesy = tokens.includes("cheesy") || tokens.includes("cheese") || tokens.includes("pizza") || tokens.includes("burger");
  
  // Extract price filter (e.g., "under 200", "below 500")
  let maxPrice: number | null = null;
  const underIndex = tokens.findIndex(t => t === "under" || t === "below" || t === "less" || t === "within");
  if (underIndex !== -1 && underIndex < tokens.length - 1) {
    const priceToken = tokens[underIndex + 1].replace(/[^0-9]/g, "");
    const parsed = parseInt(priceToken);
    if (!isNaN(parsed)) {
      maxPrice = parsed;
    }
  } else {
    // Look for any number next to ₹ or Rs, or just any standalone number
    for (const token of tokens) {
      if (token.startsWith("₹") || token.startsWith("rs") || /^\d+$/.test(token)) {
        const parsed = parseInt(token.replace(/[^0-9]/g, ""));
        if (!isNaN(parsed) && parsed > 20) {
          maxPrice = parsed;
          break;
        }
      }
    }
  }

  const results: AISearchResult[] = [];

  // Look through all restaurants and their menus
  for (const r of restaurants) {
    // Use r.menu directly, or fallback
    const itemsToSearch = r.menu && r.menu.length > 0 ? r.menu : [];
    
    for (const item of itemsToSearch) {
      let score = 0;
      const reasons: string[] = [];
      
      const itemName = item.name.toLowerCase();
      const itemDesc = (item.description || "").toLowerCase();
      const itemCat = (item.category || "").toLowerCase();
      const itemPrice = item.offerPrice || item.price;

      // 1. Direct Keyword Matching (Primary match)
      let matchesKeyword = false;
      for (const token of tokens) {
        if (token.length < 3) continue; // Skip small tokens unless it's specific like veg
        if (itemName.includes(token) || itemDesc.includes(token) || itemCat.includes(token)) {
          score += 30;
          matchesKeyword = true;
        }
      }
      if (matchesKeyword) {
        reasons.push("Matches your keyword search");
      }

      // 2. Dietary Matching
      if (wantsVeg) {
        if (item.isVeg) {
          score += 25;
          reasons.push("Vegetarian meal option");
        } else {
          score -= 40; // Penalty
        }
      }
      if (wantsNonVeg) {
        if (!item.isVeg) {
          score += 25;
          reasons.push("Non-Vegetarian protein option");
        } else {
          score -= 10;
        }
      }

      // 3. Flavor/Category Matching
      if (wantsSpicy && (itemName.includes("spicy") || itemName.includes("chilli") || itemName.includes("tikka") || itemName.includes("masala") || itemDesc.includes("spicy") || itemDesc.includes("spices") || itemDesc.includes("chili"))) {
        score += 20;
        reasons.push("Matches 'spicy' flavor preference");
      }
      if (wantsSweet && (wantsSweet && (itemCat.includes("dessert") || itemCat.includes("beverage") || itemName.includes("sweet") || itemName.includes("chocolate") || itemName.includes("cake") || itemName.includes("ice cream") || itemDesc.includes("sweet") || itemDesc.includes("chocolate") || itemDesc.includes("sugar")))) {
        score += 25;
        reasons.push("Matches 'sweet/dessert' craving");
      }
      if (wantsCheesy && (itemName.includes("cheese") || itemName.includes("pizza") || itemName.includes("cheesy") || itemDesc.includes("cheese") || itemDesc.includes("cheesy") || itemDesc.includes("mozzarella"))) {
        score += 20;
        reasons.push("Extra cheesy option");
      }

      // 4. Price Matching
      if (maxPrice !== null) {
        if (itemPrice <= maxPrice) {
          score += 25;
          reasons.push(`Budget-friendly: fits under ₹${maxPrice}`);
        } else {
          score -= 30; // Price too high penalty
        }
      }

      // 5. General descriptions
      if (q.includes("healthy") && (itemDesc.includes("healthy") || itemDesc.includes("fresh") || itemDesc.includes("protein") || itemDesc.includes("salad") || itemCat.includes("salad"))) {
        score += 15;
        reasons.push("Healthy/fresh ingredients");
      }

      // Restrict score between 0 and 100
      const finalScore = Math.max(0, Math.min(99, score));
      
      // Only include if there's some positive match score
      if (finalScore >= 40) {
        // Boost slightly if item is from a highly rated restaurant
        const boostedScore = Math.min(100, finalScore + (r.rating >= 4.5 ? 5 : 0));
        if (r.rating >= 4.5 && boostedScore > finalScore) {
          reasons.push("From a top-rated restaurant");
        }
        
        results.push({
          item,
          restaurantId: r.id,
          restaurantName: r.name,
          score: Math.round(boostedScore),
          reasons: reasons.slice(0, 3) // limit to top 3 reasons
        });
      }
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
