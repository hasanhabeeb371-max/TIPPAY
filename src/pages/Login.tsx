import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Mail, Lock, Phone, User, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const getRedirectPath = (role: UserRole) => {
    switch (role) {
      case "restaurant": return "/restaurant/dashboard";
      case "delivery": return "/delivery/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/home";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      signup(name, email, phone, password);
      navigate("/home");
    } else {
      login(email, password);
      // Detect role from email for redirect
      const role = email.endsWith("@tippay.admin.com") ? "admin"
        : email.endsWith("@tippay.agent.com") ? "delivery"
        : email.endsWith("@tippay.restaurant.com") ? "restaurant"
        : "customer";
      navigate(getRedirectPath(role));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center"
      >
        <img src={logo} alt="TIP PAY" className="mb-4 h-20 w-20" />
        <h1 className="font-display text-3xl font-bold text-foreground">TIP PAY</h1>
        <p className="mt-1 text-sm text-muted-foreground">Delicious food, delivered fast</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        {isSignup && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="pl-9" required />
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9 pr-9" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          {isSignup ? "Sign Up" : "Login"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => setIsSignup(!isSignup)} className="font-semibold text-accent underline-offset-2 hover:underline">
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        <div className="pt-2 text-center text-xs text-muted-foreground/60">
          <p>Demo: any email → Customer</p>
          <p>rest@tippay.restaurant.com → Restaurant</p>
          <p>agent@tippay.agent.com → Delivery</p>
          <p>admin@tippay.admin.com → Admin</p>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
