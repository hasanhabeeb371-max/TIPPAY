import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favoriteFoodIds: string[];
  toggleFoodFavorite: (id: string) => void;
  isFoodFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tippay_food_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tippay_food_favorites", JSON.stringify(favoriteFoodIds));
  }, [favoriteFoodIds]);

  const toggleFoodFavorite = (id: string) => {
    setFavoriteFoodIds((prev) => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const isFoodFavorite = (id: string) => favoriteFoodIds.includes(id);

  return (
    <FavoritesContext.Provider value={{ favoriteFoodIds, toggleFoodFavorite, isFoodFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
