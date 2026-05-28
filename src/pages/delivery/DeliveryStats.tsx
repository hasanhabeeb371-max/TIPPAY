import type { AgentStats } from "@/types/models";
const agentStats: AgentStats = {
  totalDeliveries: 0,
  todayDeliveries: 0,
  avgRating: 0,
  earnings: { today: 0, week: 0, month: 0 },
};
import { TrendingUp, Package, Star, DollarSign, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

const DeliveryStats = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">My Stats</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your delivery performance overview</p>
      </div>

      {/* Top Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Deliveries", value: agentStats.totalDeliveries, icon: Package, color: "text-info" },
          { label: "Today", value: agentStats.todayDeliveries, icon: Zap, color: "text-accent" },
          { label: "Avg Rating", value: agentStats.avgRating, icon: Star, color: "text-warning" },
          { label: "Completion", value: "98%", icon: Award, color: "text-success" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <stat.icon size={14} className={stat.color} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-card p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-card-foreground">
          <DollarSign size={16} className="text-success" />
          Earnings
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today", amount: agentStats.earnings.today },
            { label: "This Week", amount: agentStats.earnings.week },
            { label: "This Month", amount: agentStats.earnings.month },
          ].map((e) => (
            <div key={e.label} className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">{e.label}</p>
              <p className="mt-1 font-display text-lg font-bold text-card-foreground">₹{e.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Performance Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-xl bg-card p-5"
      >
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-card-foreground">
          <Award size={16} className="text-accent" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { badge: "🚀", title: "Speed Star", desc: "Avg delivery < 25 min" },
            { badge: "⭐", title: "Top Rated", desc: "4.5+ rating maintained" },
            { badge: "🔥", title: "Streak Master", desc: "15 deliveries without decline" },
            { badge: "💯", title: "Century Club", desc: "100+ deliveries completed" },
            { badge: "🌙", title: "Night Owl", desc: "50+ late night deliveries" },
            { badge: "🎯", title: "Zero Cancel", desc: "0 cancellations this month" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-2.5 rounded-lg bg-muted/50 p-3">
              <span className="text-xl">{b.badge}</span>
              <div>
                <p className="text-xs font-semibold text-card-foreground">{b.title}</p>
                <p className="text-[10px] text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryStats;
