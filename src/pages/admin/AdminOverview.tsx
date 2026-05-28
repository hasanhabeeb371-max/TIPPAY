const adminOverview = {
  totalRestaurants: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalAgents: 0,
  pendingApprovals: 0,
  todayOrders: 0,
  todayRevenue: 0,
};
import { Store, ShoppingBag, Users, Truck, AlertCircle, DollarSign, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const o = adminOverview;

  const stats = [
    { label: "Total Restaurants", value: o.totalRestaurants, icon: Store, color: "text-accent" },
    { label: "Total Orders", value: o.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-info" },
    { label: "Total Users", value: o.totalUsers.toLocaleString(), icon: Users, color: "text-success" },
    { label: "Total Agents", value: o.totalAgents, icon: Truck, color: "text-warning" },
  ];

  const highlights = [
    { label: "Pending Approvals", value: o.pendingApprovals, icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Today's Orders", value: o.todayOrders, icon: Clock, color: "text-info", bg: "bg-info/10" },
    { label: "Today's Revenue", value: `₹${o.todayRevenue.toLocaleString()}`, icon: DollarSign, color: "text-success", bg: "bg-success/10" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide statistics</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <s.icon size={14} className={s.color} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {highlights.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={`rounded-xl p-4 ${h.bg}`}
          >
            <h.icon size={18} className={h.color} />
            <p className="mt-2 font-display text-xl font-bold text-foreground">{h.value}</p>
            <p className="text-xs text-muted-foreground">{h.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
