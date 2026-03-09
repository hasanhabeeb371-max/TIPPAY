import type { Category } from "@/data/mockData";
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
    className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all ${
      isActive ? "bg-accent/20 ring-2 ring-accent" : "bg-card hover:bg-card/80"
    }`}
    style={{ minWidth: 72 }}
  >
    <div className="h-12 w-12 overflow-hidden rounded-full">
      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
    </div>
    <span className={`text-[10px] font-medium leading-tight ${isActive ? "text-accent-foreground" : "text-muted-foreground"}`}>
      {category.name}
    </span>
  </motion.button>
);

export default CategoryChip;
