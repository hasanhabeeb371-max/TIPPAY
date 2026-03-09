import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useReviews } from "@/context/ReviewContext";

interface Props {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  onClose?: () => void;
}

const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) => (
  <div>
    <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileTap={{ scale: 0.8 }}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            size={28}
            className={`transition-colors ${
              star <= value
                ? "fill-accent text-accent"
                : "text-border"
            }`}
          />
        </motion.button>
      ))}
    </div>
  </div>
);

const ReviewDialog = ({ orderId, restaurantId, restaurantName, onClose }: Props) => {
  const { addReview, getReviewForOrder } = useReviews();
  const existingReview = getReviewForOrder(orderId);

  const [foodRating, setFoodRating] = useState(existingReview?.foodRating || 0);
  const [deliveryRating, setDeliveryRating] = useState(existingReview?.deliveryRating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (existingReview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card p-5"
      >
        <h3 className="font-display text-sm font-semibold text-card-foreground">Your Review</h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Food</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className={s <= existingReview.foodRating ? "fill-accent text-accent" : "text-border"} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Delivery</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className={s <= existingReview.deliveryRating ? "fill-accent text-accent" : "text-border"} />
              ))}
            </div>
          </div>
          {existingReview.comment && (
            <p className="mt-1 rounded-lg bg-background p-2 text-xs text-muted-foreground italic">
              "{existingReview.comment}"
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (foodRating === 0) e.food = "Please rate the food";
    if (deliveryRating === 0) e.delivery = "Please rate the delivery";
    if (comment.length > 500) e.comment = "Review too long (max 500 chars)";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    addReview({
      orderId,
      restaurantId,
      restaurantName,
      foodRating,
      deliveryRating,
      comment: comment.trim().slice(0, 500),
    });
    toast.success("Thanks for your review! ⭐");
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card p-5"
    >
      <h3 className="font-display text-base font-semibold text-card-foreground">
        Rate your experience
      </h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{restaurantName}</p>

      <div className="mt-4 space-y-4">
        <div>
          <StarRating value={foodRating} onChange={setFoodRating} label="🍔 Food Quality" />
          {errors.food && <p className="mt-1 text-xs text-destructive">{errors.food}</p>}
        </div>

        <div>
          <StarRating value={deliveryRating} onChange={setDeliveryRating} label="🚴 Delivery Experience" />
          {errors.delivery && <p className="mt-1 text-xs text-destructive">{errors.delivery}</p>}
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare size={12} className="mr-1 inline" />
            Write a review (optional)
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="How was the food? Any feedback..."
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-0.5 text-right text-[10px] text-muted-foreground">{comment.length}/500</p>
          {errors.comment && <p className="text-xs text-destructive">{errors.comment}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onClose && (
          <Button onClick={onClose} variant="outline" size="sm" className="flex-1 text-xs">
            Later
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          size="sm"
          className="flex-1 bg-accent text-xs font-bold text-accent-foreground hover:bg-accent/90"
        >
          Submit Review
        </Button>
      </div>
    </motion.div>
  );
};

export default ReviewDialog;
