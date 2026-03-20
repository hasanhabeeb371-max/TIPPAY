import { Home, Search, ShoppingCart, Clock, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion } from "framer-motion";
const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: Clock, label: "Orders", path: "/orders" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md">

      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors"
            >
              <div className="relative">
                <item.icon
                  size={22}
                  className={isActive ? "text-accent" : "text-muted-foreground"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {item.label === "Cart" && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
