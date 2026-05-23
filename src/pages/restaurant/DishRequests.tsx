import { useState } from "react";
import { useCravings } from "@/context/CravingsContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { useRestaurants } from "@/context/RestaurantContext";
import { MessageSquare, Clock, Landmark, Send, UtensilsCrossed, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

const DishRequests = () => {
  const { cravings, addOffer } = useCravings();
  const { user } = useAuth();
  const { restaurants } = useRestaurants();
  const { t, formatPrice } = useTranslation();

  // Find this restaurant's details
  const restaurant = restaurants.find(r => r.name === user?.name || r.id === "r-1");
  const restaurantId = restaurant?.id || "r-1";
  const restaurantName = restaurant?.name || "Royal Kitchen";

  // Form states mapped by cravingId
  const [prepTimes, setPrepTimes] = useState<Record<string, string>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  const activeCravings = cravings.filter(c => c.status === "active");

  const handleSendOffer = (e: React.FormEvent, cravingId: string) => {
    e.preventDefault();
    const price = Number(prices[cravingId]);
    const prepTime = prepTimes[cravingId] || "30 mins";
    const msg = messages[cravingId] || "We can prepare this dish exactly how you request it!";

    if (isNaN(price) || price <= 0) return;

    addOffer(cravingId, restaurantId, restaurantName, price, prepTime, msg);

    // Clear forms for this craving
    setPrices(prev => ({ ...prev, [cravingId]: "" }));
    setPrepTimes(prev => ({ ...prev, [cravingId]: "" }));
    setMessages(prev => ({ ...prev, [cravingId]: "" }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Custom Dish Requests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View dish cravings broadcasted by local customers and offer to cook for them!
        </p>
      </div>

      <div className="space-y-4">
        {activeCravings.map((craving) => {
          // Check if this restaurant already submitted an offer
          const existingOffer = craving.offers.find(o => o.restaurantId === restaurantId);

          return (
            <motion.div
              key={craving.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[9px] font-bold text-accent uppercase">
                    New Request
                  </span>
                  <h3 className="mt-1.5 font-display text-base font-bold text-foreground">
                    {craving.dishName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Requested by <span className="font-medium text-foreground">{craving.customerName}</span> · {new Date(craving.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Customer Budget</p>
                  <p className="text-sm font-extrabold text-foreground">{formatPrice(craving.maxPrice)}</p>
                </div>
              </div>

              {/* Description / Instructions */}
              <div className="mt-3 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground border border-border/10 italic leading-relaxed">
                "{craving.description}"
              </div>

              <div className="mt-3 flex gap-1.5">
                {craving.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 border-t border-border/20 pt-4">
                {existingOffer ? (
                  /* Offer Details */
                  <div className="rounded-xl bg-accent/5 border border-accent/20 p-3.5">
                    <h4 className="text-xs font-bold text-accent-foreground flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-accent" />
                      Your Offer Has Been Sent
                    </h4>
                    
                    <div className="mt-2.5 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Offered Price</p>
                        <p className="font-bold text-foreground">{formatPrice(existingOffer.price)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Est. Prep Time</p>
                        <p className="font-bold text-foreground">{existingOffer.prepTime}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 bg-card p-2 rounded-lg italic">
                      Chef Note: "{existingOffer.message}"
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold">
                      {existingOffer.status === "pending" && (
                        <span className="text-warning flex items-center gap-1">
                          <AlertCircle size={12} /> Pending Customer Decision
                        </span>
                      )}
                      {existingOffer.status === "accepted" && (
                        <span className="text-success flex items-center gap-1">
                          <CheckCircle size={12} /> Offer Accepted! Check your orders.
                        </span>
                      )}
                      {existingOffer.status === "rejected" && (
                        <span className="text-destructive flex items-center gap-1">
                          <XCircle size={12} /> Offer Declined by Customer
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Form to send offer */
                  <form onSubmit={(e) => handleSendOffer(e, craving.id)} className="space-y-3.5">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <UtensilsCrossed size={13} className="text-accent" />
                      Make a Chef Offer
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`price-${craving.id}`} className="text-[10px] font-semibold text-muted-foreground">Offer Price (INR)</Label>
                        <Input
                          id={`price-${craving.id}`}
                          type="number"
                          value={prices[craving.id] || ""}
                          onChange={(e) => setPrices(prev => ({ ...prev, [craving.id]: e.target.value }))}
                          placeholder="e.g. 299"
                          className="h-8 text-xs font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`prep-${craving.id}`} className="text-[10px] font-semibold text-muted-foreground">Est. Prep Time</Label>
                        <select
                          id={`prep-${craving.id}`}
                          value={prepTimes[craving.id] || "30 mins"}
                          onChange={(e) => setPrepTimes(prev => ({ ...prev, [craving.id]: e.target.value }))}
                          className="flex h-8 w-full rounded-md border border-input bg-card px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="15 mins">15 mins</option>
                          <option value="20 mins">20 mins</option>
                          <option value="30 mins">30 mins</option>
                          <option value="45 mins">45 mins</option>
                          <option value="60 mins">60 mins</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`msg-${craving.id}`} className="text-[10px] font-semibold text-muted-foreground">Chef Message to Customer</Label>
                      <textarea
                        id={`msg-${craving.id}`}
                        value={messages[craving.id] || ""}
                        onChange={(e) => setMessages(prev => ({ ...prev, [craving.id]: e.target.value }))}
                        placeholder="Explain how you will make it special (e.g. organic paneer, extra cheese...)"
                        rows={2}
                        className="w-full text-xs font-medium bg-transparent border border-input rounded-md px-3 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="sm"
                      className="w-full bg-accent text-accent-foreground font-bold text-xs"
                    >
                      <Send size={11} className="mr-1.5" /> Send Offer
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          );
        })}

        {activeCravings.length === 0 && (
          <div className="flex flex-col items-center py-16 bg-card rounded-2xl border border-dashed border-border text-center">
            <UtensilsCrossed size={40} className="text-muted-foreground/30 mb-2" />
            <p className="font-display text-sm font-semibold text-muted-foreground">No active cravings requests</p>
            <p className="text-xs text-muted-foreground/75 mt-0.5">
              Cravings requested by nearby customers will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishRequests;
