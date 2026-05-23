import { Tag, Gift, Store, Copy, Check, Flame, Clock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ── Mock data ─────────────────────────────────────────────────────────────────

interface FoodDeal {
  id: string;
  title: string;
  description: string;
  discount: number;
  originalPrice: string;
  offerPrice: string;
  image: string;
  restaurant: string;
  expiresIn: string;
  tag?: string;
}

interface RestaurantOffer {
  id: string;
  restaurant: string;
  logo: string;
  discount: number;
  minOrder: string;
  description: string;
  expiresIn: string;
  tag?: string;
}

interface CouponCode {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: string;
  expiresIn: string;
  tag?: string;
}

const foodDeals: FoodDeal[] = [
  {
    id: "fd1",
    title: "50% Off on Biryani",
    description: "Enjoy the most loved Hyderabadi Dum Biryani at half price today only!",
    discount: 50,
    originalPrice: "₹280",
    offerPrice: "₹140",
    image: "/src/assets/food-biryani.jpg",
    restaurant: "Biryani House",
    expiresIn: "Today 11:59 PM",
    tag: "HOT",
  },
  {
    id: "fd2",
    title: "Buy 1 Get 1 Pizza",
    description: "Order any large pizza and get the second one absolutely FREE!",
    discount: 50,
    originalPrice: "₹399",
    offerPrice: "₹399 for 2",
    image: "/src/assets/food-pizza.jpg",
    restaurant: "Pizza Planet",
    expiresIn: "2 days left",
    tag: "B1G1",
  },
  {
    id: "fd3",
    title: "30% Off on Burgers",
    description: "Crispy, juicy burgers with a 30% discount on all burger combos.",
    discount: 30,
    originalPrice: "₹220",
    offerPrice: "₹154",
    image: "/src/assets/food-burger.jpg",
    restaurant: "Burger Barn",
    expiresIn: "3 days left",
  },
];

const restaurantOffers: RestaurantOffer[] = [
  {
    id: "ro1",
    restaurant: "Dosa Delight",
    logo: "/src/assets/food-dosa.jpg",
    discount: 20,
    minOrder: "₹200",
    description: "Get 20% off on all orders above ₹200 from Dosa Delight.",
    expiresIn: "Ends Sunday",
    tag: "NEW",
  },
  {
    id: "ro2",
    restaurant: "Chinese Bowl",
    logo: "/src/assets/food-chinese.jpg",
    discount: 15,
    minOrder: "₹300",
    description: "15% off on authentic Chinese dishes for orders above ₹300.",
    expiresIn: "4 days left",
  },
  {
    id: "ro3",
    restaurant: "Sweet Desserts",
    logo: "/src/assets/food-dessert.jpg",
    discount: 25,
    minOrder: "₹150",
    description: "Indulge in heavenly desserts with a 25% weekend discount!",
    expiresIn: "Ends this weekend",
    tag: "WEEKEND",
  },
];

const couponCodes: CouponCode[] = [
  {
    id: "cc1",
    code: "FIRST50",
    title: "First Order Offer",
    description: "50% off on your very first order. Welcome to TIPPAY!",
    discount: "50% OFF",
    minOrder: "₹100",
    expiresIn: "No expiry",
    tag: "NEW USER",
  },
  {
    id: "cc2",
    code: "SAVE100",
    title: "Flat ₹100 Off",
    description: "Save flat ₹100 on orders above ₹500. Limited uses.",
    discount: "₹100 OFF",
    minOrder: "₹500",
    expiresIn: "5 days left",
  },
  {
    id: "cc3",
    code: "FREEDEL",
    title: "Free Delivery",
    description: "Get free delivery on any order regardless of order value!",
    discount: "FREE DELIVERY",
    minOrder: "No minimum",
    expiresIn: "Today only",
    tag: "LIMITED",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
      <Icon size={16} className="text-white" />
    </div>
    <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
  </div>
);

const FoodDealCard = ({ deal, index }: { deal: FoodDeal; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="rounded-2xl bg-card overflow-hidden shadow-sm border border-border/40"
  >
    <div className="relative h-36 w-full">
      <img src={deal.image} alt={deal.title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      {deal.tag && (
        <span className="absolute top-2 left-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground uppercase tracking-wide">
          {deal.tag}
        </span>
      )}
      <span className="absolute top-2 right-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-extrabold text-white">
        -{deal.discount}%
      </span>
      <div className="absolute bottom-2 left-3 right-3">
        <p className="text-white font-bold text-sm leading-tight">{deal.title}</p>
        <p className="text-white/80 text-[10px]">{deal.restaurant}</p>
      </div>
    </div>
    <div className="p-3">
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{deal.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground">{deal.offerPrice}</span>
          <span className="text-xs line-through text-muted-foreground">{deal.originalPrice}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={10} />
            <span className="text-[10px]">{deal.expiresIn}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.success(`🎉 "${deal.title}" offer grabbed!`)}
            className="rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-accent-foreground hover:brightness-105 transition-all shadow-sm"
          >
            Grab Offer
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const RestaurantOfferCard = ({ offer, index }: { offer: RestaurantOffer; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm border border-border/40 items-center"
  >
    <div className="relative flex-shrink-0">
      <img src={offer.logo} alt={offer.restaurant} className="h-16 w-16 rounded-xl object-cover" />
      <span className="absolute -bottom-1 -right-1 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-extrabold text-white leading-none">
        -{offer.discount}%
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <p className="text-sm font-bold text-foreground truncate">{offer.restaurant}</p>
        {offer.tag && (
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
            {offer.tag}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{offer.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock size={10} />
          <span className="text-[10px]">{offer.expiresIn}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.success(`🏪 Offer from ${offer.restaurant} applied!`)}
          className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:brightness-110 transition-all shadow-sm"
        >
          Apply
        </motion.button>
      </div>
      <p className="text-[10px] text-muted-foreground/70 mt-0.5">Min. order: {offer.minOrder}</p>
    </div>
  </motion.div>
);

const CouponCard = ({ coupon, index }: { coupon: CouponCode; index: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    toast.success(`Coupon code "${coupon.code}" copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl bg-card shadow-sm border border-dashed border-accent/50 overflow-hidden"
    >
      {/* Ticket notch effect */}
      <div className="flex">
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-bold text-foreground">{coupon.title}</p>
              {coupon.tag && (
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-accent text-accent-foreground mt-0.5">
                  {coupon.tag}
                </Badge>
              )}
            </div>
            <span className="text-sm font-extrabold text-accent">{coupon.discount}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{coupon.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Min: {coupon.minOrder}</p>
              <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                <Clock size={9} />
                <span className="text-[10px]">{coupon.expiresIn}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-dashed border-accent/60 bg-accent/10 px-2.5 py-1">
                <span className="text-xs font-bold text-accent tracking-widest">{coupon.code}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-all hover:brightness-105"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Tab content sections ──────────────────────────────────────────────────────

const tabContentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

const HotDealsSection = () => (
  <div className="flex flex-col gap-3">
    {foodDeals.map((deal, i) => (
      <FoodDealCard key={deal.id} deal={deal} index={i} />
    ))}
  </div>
);

const RestaurantOffersSection = () => (
  <div className="flex flex-col gap-3">
    {restaurantOffers.map((offer, i) => (
      <RestaurantOfferCard key={offer.id} offer={offer} index={i} />
    ))}
  </div>
);

const CouponsSection = () => (
  <div className="flex flex-col gap-3">
    {couponCodes.map((coupon, i) => (
      <CouponCard key={coupon.id} coupon={coupon} index={i} />
    ))}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const OffersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const totalCount = foodDeals.length + restaurantOffers.length + couponCodes.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 px-4 py-4 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-card p-2 text-foreground transition-colors hover:bg-muted"
          >
            <Tag size={18} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">Offers & Deals</h1>
            <p className="text-[11px] text-muted-foreground">Save more on every order</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-accent to-primary p-4 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Flame size={16} className="text-yellow-300" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">Limited Time</span>
            </div>
            <p className="text-xl font-extrabold leading-tight">Up to 50% OFF</p>
            <p className="text-sm text-white/80 mt-0.5">On your favourite food &amp; restaurants</p>
          </div>
          <div className="text-5xl select-none">🎉</div>
        </div>
      </motion.div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur-md border-b border-border/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-2">
            <TabsList className="w-full h-auto flex gap-1 bg-muted/60 p-1.5 rounded-xl overflow-x-auto scrollbar-none">
              <TabsTrigger
                value="all"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground whitespace-nowrap transition-all flex-shrink-0"
              >
                <Tag size={13} />
                All
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] rounded-full bg-foreground/10 px-1 text-[10px] font-bold data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                  {totalCount}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="hot-deals"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground whitespace-nowrap transition-all flex-shrink-0"
              >
                <Flame size={13} />
                Hot Deals
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] rounded-full bg-foreground/10 px-1 text-[10px] font-bold">
                  {foodDeals.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="restaurant-offers"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground whitespace-nowrap transition-all flex-shrink-0"
              >
                <Store size={13} />
                Restaurants
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] rounded-full bg-foreground/10 px-1 text-[10px] font-bold">
                  {restaurantOffers.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="coupons"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground whitespace-nowrap transition-all flex-shrink-0"
              >
                <Ticket size={13} />
                Coupons
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] rounded-full bg-foreground/10 px-1 text-[10px] font-bold">
                  {couponCodes.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="px-4 pt-4 pb-4">
            <TabsContent value="all" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "all" && (
                  <motion.div
                    key="all"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col gap-6"
                  >
                    <section>
                      <SectionHeader icon={Flame} title="Hot Deals" color="bg-destructive" />
                      <HotDealsSection />
                    </section>
                    <section>
                      <SectionHeader icon={Store} title="Restaurant Offers" color="bg-primary" />
                      <RestaurantOffersSection />
                    </section>
                    <section>
                      <SectionHeader icon={Gift} title="Coupon Codes" color="bg-accent" />
                      <CouponsSection />
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="hot-deals" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "hot-deals" && (
                  <motion.div
                    key="hot-deals"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <HotDealsSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="restaurant-offers" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "restaurant-offers" && (
                  <motion.div
                    key="restaurant-offers"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <RestaurantOffersSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="coupons" className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === "coupons" && (
                  <motion.div
                    key="coupons"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <CouponsSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default OffersPage;
