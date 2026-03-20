import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, LogOut, ChevronRight, MapPin, Heart, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { useAddress } from "@/context/AddressContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addresses } = useAddress();

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const menuItems = [
    { icon: MapPin, label: "Saved Addresses", desc: `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}`, action: () => navigate("/addresses") },
    { icon: Heart, label: "Favorites", desc: "Your favorite restaurants", action: () => navigate("/favorites") },
    { icon: Settings, label: "Settings", desc: "Manage your account preferences", action: () => navigate("/settings") },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6">
        <h1 className="font-display text-lg font-bold">Profile</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 rounded-2xl bg-card p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <User size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-card-foreground">{user?.name || "Guest"}</h2>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail size={12} />
              {user?.email || "Not logged in"}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone size={12} />
              {user?.phone || "N/A"}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mx-4 mt-4 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={item.action}
            className="flex w-full items-center gap-3 rounded-xl bg-card p-4 text-left"
          >
            <item.icon size={18} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      <div className="mx-4 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex w-full items-center gap-3 rounded-xl bg-card p-4"
        >
          <Moon size={18} className="text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-card-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch to dark theme</p>
          </div>
          <Switch checked={isDark} onCheckedChange={setIsDark} />
        </motion.div>
      </div>

      <div className="mx-4 mt-6">
        <Button onClick={handleLogout} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
