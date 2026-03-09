import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(onFinish, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
        >
          <img src={logo} alt="TIP PAY" className="h-24 w-24 drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          className="mt-6 font-display text-4xl font-bold tracking-tight text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase === "text" || phase === "exit" ? 1 : 0, y: phase === "text" || phase === "exit" ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          TIP PAY
        </motion.h1>

        <motion.p
          className="mt-2 text-sm text-primary-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "text" || phase === "exit" ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Delicious food, delivered fast
        </motion.p>

        <motion.div
          className="mt-10 h-1 w-16 rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: phase === "text" || phase === "exit" ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
