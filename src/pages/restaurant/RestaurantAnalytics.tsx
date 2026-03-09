import { useState } from "react";
import { analyticsData } from "@/data/restaurantMockData";
import { TrendingUp, ShoppingBag, DollarSign, Star } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Period = "daily" | "weekly" | "monthly" | "yearly";

const periods: { label: string; value: Period }[] = [
  { label: "Today", value: "daily" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
  { label: "This Year", value: "yearly" },
];

const PIE_COLORS = [
  "hsl(39, 90%, 60%)",
  "hsl(39, 90%, 50%)",
  "hsl(39, 60%, 45%)",
  "hsl(0, 0%, 30%)",
  "hsl(0, 0%, 50%)",
];

const RestaurantAnalytics = () => {
  const [period, setPeriod] = useState<Period>("daily");
  const data = analyticsData[period];

  const avgOrderValue = Math.round(data.revenue / data.totalOrders);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track your restaurant performance</p>
      </div>

      {/* Period Toggle */}
      <div className="mb-6 flex gap-1 rounded-xl bg-card p-1">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
              period === p.value ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Orders", value: data.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-info" },
          { label: "Revenue", value: `₹${data.revenue.toLocaleString()}`, icon: DollarSign, color: "text-success" },
          { label: "Avg Order Value", value: `₹${avgOrderValue}`, icon: TrendingUp, color: "text-accent" },
          { label: "Top Item", value: data.popularItems[0].name, icon: Star, color: "text-warning" },
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
            <p className="mt-2 font-display text-lg font-bold text-card-foreground truncate">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Order Trend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card p-4"
        >
          <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">Order Trends</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(39, 30%, 88%)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(0,0%,40%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,40%)" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0,0%,100%)",
                    border: "1px solid hsl(39,30%,88%)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="orders" fill="hsl(39, 90%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Popular Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-card p-4"
        >
          <h3 className="mb-4 font-display text-sm font-semibold text-card-foreground">Popular Items</h3>
          <div className="flex items-center gap-4">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.popularItems}
                    dataKey="orders"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {data.popularItems.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(0,0%,100%)",
                      border: "1px solid hsl(39,30%,88%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 min-w-0">
              {data.popularItems.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate text-xs text-card-foreground">{item.name}</span>
                  <span className="ml-auto shrink-0 text-xs font-semibold text-muted-foreground">{item.orders}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantAnalytics;
