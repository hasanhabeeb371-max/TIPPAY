import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, updateQuantity } = useCart();
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Restaurant not found</div>;
  }

  const menuCategories = [...new Set(restaurant.menu.map((m) => m.category))];

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((i) => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner */}
      <div className="relative h-48">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-full bg-background/80 p-2 backdrop-blur-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-4 left-4">
          <h1 className="font-display text-2xl font-bold text-background">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-background/80">
            <span className="flex items-center gap-1"><Star size={12} className="fill-accent text-accent" />{restaurant.rating}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{restaurant.deliveryTime}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{restaurant.distance}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 pt-4">
        {menuCategories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h2>
            <div className="space-y-3">
              {restaurant.menu
                .filter((m) => m.category === cat)
                .map((item, i) => {
                  const qty = getItemQuantity(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 rounded-xl bg-card p-3"
                    >
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            {item.isVeg && <Leaf size={12} className="text-success" />}
                            <h3 className="text-sm font-semibold text-card-foreground">{item.name}</h3>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-card-foreground">₹{item.offerPrice || item.price}</span>
                            {item.offerPrice && (
                              <span className="text-xs text-muted-foreground line-through">₹{item.price}</span>
                            )}
                          </div>
                          {qty === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                addItem(item, restaurant.id, restaurant.name);
                                toast.success(`${item.name} added to cart`);
                              }}
                              className="h-7 bg-accent px-3 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                            >
                              ADD
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 rounded-full bg-accent/20 px-1">
                              <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="rounded-full p-1 text-accent-foreground hover:bg-accent/30"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-[16px] text-center text-sm font-bold text-accent-foreground">{qty}</span>
                              <button
                                onClick={() => {
                                  addItem(item, restaurant.id, restaurant.name);
                                }}
                                className="rounded-full p-1 text-accent-foreground hover:bg-accent/30"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default RestaurantPage;
