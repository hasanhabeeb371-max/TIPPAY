import type { AdminUser } from "@/types/models";
const adminUsers: AdminUser[] = [];
import { Mail, Phone, ShoppingBag, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const AdminUsers = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">User Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">{adminUsers.length} registered users</p>
      </div>

      <div className="space-y-3">
        {adminUsers.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-xl bg-card p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-info/15 font-display text-base font-bold text-info">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-semibold text-card-foreground">{user.name}</h3>
              <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail size={10} />{user.email}</span>
                <span className="flex items-center gap-1"><Phone size={10} />{user.phone}</span>
              </div>
            </div>
            <div className="hidden shrink-0 gap-4 sm:flex">
              <div className="text-center">
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><ShoppingBag size={10} />Orders</p>
                <p className="font-display text-base font-bold text-card-foreground">{user.totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={10} />Joined</p>
                <p className="text-xs font-medium text-card-foreground">{user.joinedDate}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
