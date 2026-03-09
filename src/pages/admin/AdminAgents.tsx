import { adminAgents } from "@/data/adminMockData";
import { Star, Package, Phone, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const AdminAgents = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Delivery Agent Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">{adminAgents.length} registered agents</p>
      </div>

      <div className="space-y-3">
        {adminAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-xl bg-card p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 font-display text-lg font-bold text-accent">
              {agent.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-semibold text-card-foreground">{agent.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  agent.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {agent.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail size={10} />{agent.email}</span>
                <span className="flex items-center gap-1"><Phone size={10} />{agent.phone}</span>
              </div>
            </div>
            <div className="hidden shrink-0 gap-4 sm:flex">
              <div className="text-center">
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Package size={10} />Deliveries</p>
                <p className="font-display text-base font-bold text-card-foreground">{agent.completedDeliveries}</p>
              </div>
              <div className="text-center">
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={10} />Rating</p>
                <p className="font-display text-base font-bold text-accent">{agent.rating}</p>
              </div>
              <div className="text-center">
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={10} />Joined</p>
                <p className="text-xs font-medium text-card-foreground">{agent.joinedDate}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminAgents;
