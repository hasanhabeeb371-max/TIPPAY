import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCart } from "@/context/CartContext";
import type { MenuItem } from "@/types/models";
import { toast } from "sonner";

export interface RestaurantOffer {
  id: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  prepTime: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface CravingRequest {
  id: string;
  customerEmail: string;
  customerName: string;
  dishName: string;
  description: string;
  maxPrice: number;
  tags: string[];
  status: "active" | "fulfilled" | "expired";
  createdAt: string;
  offers: RestaurantOffer[];
}

interface CravingsContextType {
  cravings: CravingRequest[];
  addCraving: (customerEmail: string, customerName: string, dishName: string, description: string, maxPrice: number, tags: string[]) => void;
  addOffer: (cravingId: string, restaurantId: string, restaurantName: string, price: number, prepTime: string, message: string) => void;
  acceptOffer: (cravingId: string, offerId: string) => void;
  rejectOffer: (cravingId: string, offerId: string) => void;
}

const CravingsContext = createContext<CravingsContextType | undefined>(undefined);

export const CravingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addItem } = useCart();
  const [cravings, setCravings] = useState<CravingRequest[]>(() => {
    const saved = localStorage.getItem("tippay_cravings");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("tippay_cravings", JSON.stringify(cravings));
  }, [cravings]);

  const addCraving = (
    customerEmail: string,
    customerName: string,
    dishName: string,
    description: string,
    maxPrice: number,
    tags: string[]
  ) => {
    const newCraving: CravingRequest = {
      id: `crav-${Date.now()}`,
      customerEmail,
      customerName,
      dishName,
      description,
      maxPrice,
      tags,
      status: "active",
      createdAt: new Date().toISOString(),
      offers: [],
    };
    setCravings((prev) => [newCraving, ...prev]);
    toast.success("Your dish craving has been broadcasted to local chefs! 👨‍🍳");
  };

  const addOffer = (
    cravingId: string,
    restaurantId: string,
    restaurantName: string,
    price: number,
    prepTime: string,
    message: string
  ) => {
    setCravings((prev) =>
      prev.map((c) => {
        if (c.id !== cravingId) return c;
        const newOffer: RestaurantOffer = {
          id: `off-${Date.now()}`,
          restaurantId,
          restaurantName,
          price,
          prepTime,
          message,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        return {
          ...c,
          offers: [...c.offers, newOffer],
        };
      })
    );
    toast.success("Offer submitted to customer successfully!");
  };

  const acceptOffer = (cravingId: string, offerId: string) => {
    const craving = cravings.find((c) => c.id === cravingId);
    if (!craving) return;
    const offer = craving.offers.find((o) => o.id === offerId);
    if (!offer) return;

    // 1. Add to cart as a special menu item
    const customItem: MenuItem = {
      id: `custom-dish-${craving.id}`,
      name: `Chef Custom: ${craving.dishName}`,
      description: `Requested by you. Chef note: "${offer.message}"`,
      price: offer.price,
      offerPrice: offer.price,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      category: "Custom Request",
      isVeg: craving.tags.includes("veg"),
    };

    addItem(customItem, offer.restaurantId, offer.restaurantName);

    // 2. Update status of craving and offers
    setCravings((prev) =>
      prev.map((c) => {
        if (c.id !== cravingId) return c;
        return {
          ...c,
          status: "fulfilled",
          offers: c.offers.map((o) =>
            o.id === offerId ? { ...o, status: "accepted" } : { ...o, status: "rejected" }
          ),
        };
      })
    );

    toast.success(`Accepted ${offer.restaurantName}'s offer! Added to cart.`);
  };

  const rejectOffer = (cravingId: string, offerId: string) => {
    setCravings((prev) =>
      prev.map((c) => {
        if (c.id !== cravingId) return c;
        return {
          ...c,
          offers: c.offers.map((o) => (o.id === offerId ? { ...o, status: "rejected" } : o)),
        };
      })
    );
    toast.info("Offer declined.");
  };

  return (
    <CravingsContext.Provider value={{ cravings, addCraving, addOffer, acceptOffer, rejectOffer }}>
      {children}
    </CravingsContext.Provider>
  );
};

export const useCravings = () => {
  const context = useContext(CravingsContext);
  if (!context) {
    throw new Error("useCravings must be used within CravingsProvider");
  }
  return context;
};
