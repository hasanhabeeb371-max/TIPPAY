import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, LogOut, ChevronRight, MapPin, Heart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";

const menuItems = [
  { icon: MapPin, label: "Saved Addresses", desc: "Manage delivery addresses" },
  { icon: Heart, label: "Favorites", desc: "Your favorite restaurants" },
  { icon: HelpCircle, label: "Help & Support", desc: "Get help with orders" },
];

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6">
        <h1 className="font-display text-lg font-bold">Profile</h1>
      </div>

      {/* User Card */}
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

      {/* Menu */}
      <div className="mx-4 mt-4 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
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
