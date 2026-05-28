import type { Category } from "@/types/models";
import { motion } from "framer-motion";

interface Props {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  index?: number;
}

const CategoryChip = ({ category, isActive, onClick, index = 0 }: Props) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.04 }}
    onClick={onClick}
    className={`flex shrink-0 flex-col items-center gap-1.5 rounded-full px-1.5 py-1 text-xs font-semibold transition-all ${
      isActive
        ? "text-accent"
        : "text-foreground hover:text-accent"
    }`}
    style={{ minWidth: 70 }}
  >
    <span
      className={`h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-sm ring-1 transition-all ${
        isActive ? "ring-accent shadow-accent/10" : "ring-border/40"
      }`}
    >
      <img src={category.image} alt={category.name} className="h-full w-full rounded-full object-cover" />
    </span>
    <span className="max-w-[68px] text-center text-[10px] leading-tight">{category.name}</span>
  </motion.button>
);

export default CategoryChip;
