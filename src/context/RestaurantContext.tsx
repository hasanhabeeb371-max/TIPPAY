import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Restaurant, MenuItem, AdminRestaurant, RestaurantMenuItem } from "@/types/models";
import { useLocationContext } from "@/context/LocationContext";
import { getDistance, generateRandomCoordinates } from "@/utils/distance";
import { seedKadupunindaRestaurant, seedKadupunindaMenu } from "@/data/seedKadupuninda";

function readStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  adminRestaurants: AdminRestaurant[];
  menuItems: RestaurantMenuItem[];
  addAdminRestaurant: (r: AdminRestaurant) => void;
  updateAdminRestaurantStatus: (id: string, status: AdminRestaurant["status"]) => void;
  deleteAdminRestaurant: (id: string) => void;
  addMenuItem: (item: RestaurantMenuItem) => void;
  updateMenuItem: (item: RestaurantMenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [adminRestaurants, setAdminRestaurants] = useState<AdminRestaurant[]>(() => {
    const saved = readStored<AdminRestaurant[]>("tippay_admin_restaurants");
    const parsed = saved || [];
    if (!parsed.some(r => r.id === seedKadupunindaRestaurant.id)) {
      parsed.push(seedKadupunindaRestaurant);
    }
    return parsed;
  });

  const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>(() => {
    const saved = readStored<RestaurantMenuItem[]>("tippay_menu_items");
    const parsed = saved || [];
    seedKadupunindaMenu.forEach(seedItem => {
      const existingIdx = parsed.findIndex(i => i.id === seedItem.id);
      if (existingIdx === -1) {
        parsed.push(seedItem);
      } else {
        parsed[existingIdx] = { ...parsed[existingIdx], image: seedItem.image, restaurantId: seedItem.restaurantId };
      }
    });
    return parsed;
  });

  const { userLocation } = useLocationContext();

  useEffect(() => {
    if (userLocation) {
      setAdminRestaurants((prev) => {
        let needsUpdate = false;
        const updated = prev.map((r) => {
          if (!r.lat || !r.lng || getDistance(userLocation.lat, userLocation.lng, r.lat, r.lng) > 50) {
            needsUpdate = true;
            const coords = generateRandomCoordinates(userLocation.lat, userLocation.lng, Math.max(0.8, Math.random() * 5));
            return { ...r, lat: coords.lat, lng: coords.lng };
          }
          return r;
        });
        return needsUpdate ? updated : prev;
      });
    }
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem("tippay_admin_restaurants", JSON.stringify(adminRestaurants));
  }, [adminRestaurants]);

  useEffect(() => {
    localStorage.setItem("tippay_menu_items", JSON.stringify(menuItems));
  }, [menuItems]);

  const addAdminRestaurant = (r: AdminRestaurant) => setAdminRestaurants((prev) => [...prev, r]);
  
  const updateAdminRestaurantStatus = (id: string, status: AdminRestaurant["status"]) => {
    setAdminRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };
  
  const deleteAdminRestaurant = (id: string) => {
    setAdminRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  const addMenuItem = (item: RestaurantMenuItem) => setMenuItems((prev) => [...prev, item]);
  
  const updateMenuItem = (item: RestaurantMenuItem) => setMenuItems((prev) => prev.map((i) => i.id === item.id ? item : i));
  
  const deleteMenuItem = (id: string) => setMenuItems((prev) => prev.filter((i) => i.id !== id));
  
  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((i) => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const activeRestaurants = adminRestaurants.filter((r) => r.status === "approved");
  const derivedRestaurants: Restaurant[] = activeRestaurants.map((ar) => {
    const calculatedDistance =
      userLocation && ar.lat && ar.lng
        ? getDistance(userLocation.lat, userLocation.lng, ar.lat, ar.lng).toFixed(1) + " km"
        : "1.2 km";

    const menu: MenuItem[] = menuItems
          .filter((m) => m.isAvailable && m.restaurantId === ar.id)
          .map(
            (m) =>
              ({
                id: m.id,
                name: m.name,
                description: m.description,
                price: m.price,
                offerPrice: m.offerPrice,
                image: m.image,
                category: m.category,
                isVeg: m.isVeg,
              }) as MenuItem
          );

    return {
      id: ar.id,
      name: ar.name,
      image: ar.image,
      category: ar.category,
      rating: 4.5,
      distance: calculatedDistance,
      deliveryTime: "30-45 min",
      isOpen: true,
      lat: ar.lat,
      lng: ar.lng,
      menu,
    };
  });

  const restaurants: Restaurant[] =
    derivedRestaurants.length > 0
      ? [...derivedRestaurants].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      : [];

  return (
    <RestaurantContext.Provider value={{
      restaurants, adminRestaurants, menuItems,
      addAdminRestaurant, updateAdminRestaurantStatus, deleteAdminRestaurant,
      addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurants must be used within a RestaurantProvider");
  }
  return context;
}
