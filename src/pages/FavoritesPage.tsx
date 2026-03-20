import { ArrowLeft, Heart, ShoppingCart, Zap, Plus, Minus, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { useCart } from "@/context/CartContext";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favoriteFoodIds, toggleFoodFavorite, isFoodFavorite } = useFavorites();
  const { restaurants } = useRestaurants();
  const { items, addItem, updateQuantity } = useCart();

  const favoriteItems = restaurants.flatMap(r => 
    r.menu.filter(m => favoriteFoodIds.includes(m.id)).map(m => ({ item: m, restaurant: r }))
  );

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleBuyNow = (item: any, restaurant: any) => {
    const qty = getItemQuantity(item.id);
    if (qty === 0) {
      addItem(item, restaurant.id, restaurant.name);
    }
    toast.success(`Proceeding to checkout with ${item.name}!`);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 px-4 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2 text-foreground transition-colors hover:bg-muted">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-display text-lg font-bold">Favorite Foods</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        {favoriteItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {favoriteItems.map(({ item, restaurant }, i) => {
              const qty = getItemQuantity(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex gap-3 rounded-xl bg-card p-3 relative shadow-sm"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFoodFavorite(item.id);
                      }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform hover:scale-110 shadow-sm"
                    >
                      <Heart size={12} className={isFoodFavorite(item.id) ? "fill-accent text-accent" : "text-foreground"} />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div onClick={() => navigate(`/restaurant/${restaurant.id}`)} className="cursor-pointer hover:underline">
                      <div className="flex items-center gap-1.5">
                        {item.isVeg && <Leaf size={12} className="text-success" />}
                        <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">{item.name}</h3>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">{restaurant.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <div className="mt-1.5 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-card-foreground">₹{item.offerPrice || item.price}</span>
                        {item.offerPrice && (
                          <span className="text-xs text-muted-foreground line-through">₹{item.price}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {qty === 0 ? (
                          <>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                addItem(item, restaurant.id, restaurant.name);
                                toast.success(`${item.name} added to cart`);
                              }}
                              className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-md transition-all hover:shadow-lg hover:brightness-105 active:shadow-sm"
                            >
                              <ShoppingCart size={12} />
                              ADD
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBuyNow(item, restaurant)}
                              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 active:shadow-sm"
                            >
                              <Zap size={12} />
                              BUY NOW
                            </motion.button>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-1.5 shadow-sm">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="rounded-full p-1 text-accent-foreground transition-colors hover:bg-accent/30"
                              >
                                <Minus size={14} />
                              </motion.button>
                              <motion.span
                                key={qty}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                className="min-w-[16px] text-center text-sm font-bold text-accent-foreground"
                              >
                                {qty}
                              </motion.span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => addItem(item, restaurant.id, restaurant.name)}
                                className="rounded-full p-1 text-accent-foreground transition-colors hover:bg-accent/30"
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate("/cart")}
                              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
                            >
                              <Zap size={12} />
                              CART
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart size={32} className="text-muted-foreground/30" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-muted-foreground">No favorite foods yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Start exploring and heart your favorite dishes!</p>
            <button onClick={() => navigate("/home")} className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/90 transition-colors">
              Explore Deals
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FavoritesPage;
