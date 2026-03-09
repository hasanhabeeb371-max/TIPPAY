import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Review {
  id: string;
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  foodRating: number;
  deliveryRating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  getReviewForOrder: (orderId: string) => Review | undefined;
  getReviewsForRestaurant: (restaurantId: string) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const STORAGE_KEY = "tippay_reviews";

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved, (key, val) => key === "createdAt" ? new Date(val) : val);
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((data: Omit<Review, "id" | "createdAt">) => {
    setReviews((prev) => [
      { ...data, id: `rev-${Date.now()}`, createdAt: new Date() },
      ...prev,
    ]);
  }, []);

  const getReviewForOrder = useCallback(
    (orderId: string) => reviews.find((r) => r.orderId === orderId),
    [reviews]
  );

  const getReviewsForRestaurant = useCallback(
    (restaurantId: string) => reviews.filter((r) => r.restaurantId === restaurantId),
    [reviews]
  );

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewForOrder, getReviewsForRestaurant }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewProvider");
  return ctx;
};
