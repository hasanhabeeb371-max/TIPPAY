import { motion } from "framer-motion";
import type { HotDeal } from "@/types/models";

interface HotDealsCarouselProps {
  deals: HotDeal[];
}

const HotDealsCarousel = ({ deals }: HotDealsCarouselProps) => {
  return (
    <div className="mt-5 px-4 overflow-hidden">
      <h2 className="mb-3 font-display text-base font-semibold text-foreground">Hot Deals & Offers</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory hide-scroll">
        {deals.map((deal) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-[80vw] sm:w-[300px] md:w-[320px] rounded-2xl overflow-hidden snap-center flex-shrink-0 shadow-sm"
          >
            <div className="aspect-[16/9] relative">
              <img src={deal.image} alt={deal.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                {deal.discount}
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold leading-tight line-clamp-2 shadow-black/50 drop-shadow-md">{deal.title}</h3>
                <p className="text-sm text-white/90 mt-1 font-medium shadow-black/50 drop-shadow-md">{deal.restaurantName}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HotDealsCarousel;
