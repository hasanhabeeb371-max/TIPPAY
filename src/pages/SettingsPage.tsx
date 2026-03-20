import { useNavigate } from "react-router-dom";
import { User, Bell, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const navigate = useNavigate();

  const settingItems = [
    { icon: User, label: "Edit Profile", desc: "Change your personal details", action: () => navigate("/settings/edit-profile") },
    { icon: Bell, label: "Notification Settings", desc: "Manage alerts and updates", action: () => {} },
    { icon: Smartphone, label: "App Permissions", desc: "Location and camera access", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="font-display text-lg font-bold">Settings</h1>
      </div>

      <div className="mx-4 mt-6 space-y-2">
        {settingItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={item.action}
            className="flex w-full items-center gap-3 rounded-xl bg-card p-4 text-left shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <item.icon size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
