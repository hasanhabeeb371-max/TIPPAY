import { useAuth } from "@/context/AuthContext";
import { Star, Package, Phone, Mail, Calendar, Check, Ban, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const AdminAgents = () => {
  const { users, updateUserStatusByEmail } = useAuth();
  const deliveryAgents = users.filter(u => u.role === "delivery");

  const updateStatus = (email: string, status: "active" | "suspended" | "pending") => {
    updateUserStatusByEmail(email, status);
    toast.success(`Agent ${status === "active" ? "approved" : "suspended"}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Delivery Agent Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">{deliveryAgents.length} registered agents</p>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {deliveryAgents.map((agent, i) => (
            <motion.div
              layout
              key={agent.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                    agent.status === "active" ? "bg-success/15 text-success" :
                    agent.status === "pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail size={10} />{agent.email}</span>
                  <span className="flex items-center gap-1"><Phone size={10} />{agent.phone}</span>
                </div>
              </div>
              <div className="hidden shrink-0 gap-4 sm:flex items-center">
                <div className="text-center mr-4">
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Calendar size={10} />Joined</p>
                  <p className="text-xs font-medium text-card-foreground">{agent.joinedDate}</p>
                </div>
                {agent.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(agent.email, "active")} className="rounded-lg p-2 text-success hover:bg-success/10"><Check size={16} /></button>
                    <button onClick={() => updateStatus(agent.email, "suspended")} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><X size={16} /></button>
                  </>
                )}
                {agent.status === "active" && (
                  <button onClick={() => updateStatus(agent.email, "suspended")} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Ban size={16} /></button>
                )}
                {agent.status === "suspended" && (
                  <button onClick={() => updateStatus(agent.email, "active")} className="rounded-lg p-2 text-success hover:bg-success/10"><Check size={16} /></button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminAgents;
