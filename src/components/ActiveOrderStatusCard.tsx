import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { OrderStatus } from "@/data/mockData";
import {
  CircleDot,
  Clock,
  ChefHat,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const STATUS_FLOW: OrderStatus[] = [
  "Ordered",
  "Accepted",
  "Preparing",
  "Ready",
  "Picked Up",
  "Delivered",
];

const statusConfig: Record<
  OrderStatus,
  { icon: React.ElementType; label: string; pill: string }
> = {
  Ordered: { icon: CircleDot, label: "Placed", pill: "text-sky-600 bg-sky-500/10" },
  Accepted: { icon: Clock, label: "Accepted", pill: "text-sky-600 bg-sky-500/10" },
  Preparing: { icon: ChefHat, label: "Preparing", pill: "text-amber-600 bg-amber-500/10" },
  Ready: { icon: Package, label: "Ready", pill: "text-accent bg-accent/10" },
  "Picked Up": { icon: Truck, label: "On the way", pill: "text-accent bg-accent/10" },
  Delivered: { icon: CheckCircle2, label: "Delivered", pill: "text-emerald-600 bg-emerald-500/10" },
};

export interface ActiveOrderDisplay {
  id: string;
  restaurantName: string;
  status: OrderStatus;
  itemSummary: string;
  estimatedDelivery?: string;
  isLive: boolean;
}

interface Props {
  order: ActiveOrderDisplay;
}

const ActiveOrderStatusCard = ({ order }: Props) => {
  const navigate = useNavigate();
  const { icon: StatusIcon, label, pill } = statusConfig[order.status];
  const stepIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => (order.isLive ? navigate(`/order/${order.id}`) : navigate("/orders"))}
      className="group relative w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-accent/[0.04] px-3 py-2.5 text-left shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)] transition-all hover:border-accent/30 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground shadow-sm ring-1 ring-border/20">
          <StatusIcon size={13} className="text-background" strokeWidth={2.25} />
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-card"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[11px] font-semibold leading-tight text-foreground">
              {order.restaurantName}
            </p>
            <span className={`shrink-0 rounded-full px-1.5 py-px text-[9px] font-bold uppercase tracking-wide ${pill}`}>
              {label}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{order.itemSummary}</p>
        </div>

        <ChevronRight
          size={14}
          className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>

      <div className="relative mt-2 flex gap-1">
        {STATUS_FLOW.slice(0, -1).map((step, i) => (
          <div
            key={step}
            className={`h-[3px] flex-1 rounded-full transition-colors ${
              i <= stepIndex ? "bg-accent" : "bg-muted/80"
            }`}
          />
        ))}
      </div>
    </motion.button>
  );
};

export default ActiveOrderStatusCard;
