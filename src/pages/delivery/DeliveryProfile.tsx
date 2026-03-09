import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";

const DeliveryProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Agent Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your delivery agent information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <User size={28} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-card-foreground">{user?.name || "Agent"}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
              <Shield size={10} />
              Verified Agent
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { icon: Mail, label: "Email", value: user?.email || "N/A" },
            { icon: Phone, label: "Phone", value: user?.phone || "N/A" },
            { icon: MapPin, label: "Zone", value: "Bangalore Central" },
          ].map((info) => (
            <div key={info.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <info.icon size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{info.label}</p>
                <p className="text-sm font-medium text-card-foreground">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryProfile;
