import { useState } from "react";
import { motion } from "framer-motion";
import { User, Store, Bike } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Portal = () => {
  const navigate = useNavigate();
  const [lastTap, setLastTap] = useState(0);

  const handleAdminRoute = () => {
    navigate("/login?type=admin");
  };

  const handleLogoTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleAdminRoute();
    } else {
      setLastTap(now);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center"
      >
        <img
          src={logo}
          alt="TIP PAY"
          className="mb-6 h-24 w-24 drop-shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform select-none"
          onClick={handleLogoTap}
          onDoubleClick={handleAdminRoute}
        />
        <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight text-center leading-tight">Welcome to TIP PAY! 👋</h1>
        <p className="mt-3 text-base text-muted-foreground text-center">We're so glad you're here. How would you like to continue?</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/login?type=user')}
          className="flex w-full items-center gap-5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md hover:scale-[1.02]"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User size={28} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-card-foreground">Customer</h3>
            <p className="text-sm text-muted-foreground">Order delicious food fast</p>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/login?type=restaurant')}
          className="flex w-full items-center gap-5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-orange-500 hover:shadow-md hover:scale-[1.02]"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/10">
            <Store size={28} className="text-orange-500" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-card-foreground">Restaurant Partner</h3>
            <p className="text-sm text-muted-foreground">Manage your menu and orders</p>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/login?type=delivery')}
          className="flex w-full items-center gap-5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md hover:scale-[1.02]"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <Bike size={28} className="text-blue-500" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-card-foreground">Delivery Agent</h3>
            <p className="text-sm text-muted-foreground">Deliver orders and earn instantly</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default Portal;
