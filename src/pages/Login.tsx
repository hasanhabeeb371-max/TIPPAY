import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Mail, Lock, Phone, User, Eye, EyeOff, MapPin, Store, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRestaurants } from "@/context/RestaurantContext";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [gstin, setGstin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addAdminRestaurant } = useRestaurants();
  const portalType = searchParams.get("type") || "user"; // "user" | "restaurant" | "delivery" | "admin"

  const portalThemes = {
    user: { title: "TIP PAY", desc: "Delicious food, delivered fast", btn: "bg-primary text-primary-foreground hover:bg-primary/90" },
    restaurant: { title: "Restaurant Portal", desc: "Manage your restaurant business", btn: "bg-orange-500 text-white hover:bg-orange-600" },
    delivery: { title: "Delivery Agent Portal", desc: "Start earning instantly today", btn: "bg-blue-500 text-white hover:bg-blue-600" },
    admin: { title: "Admin Portal", desc: "Manage the TIP PAY platform", btn: "bg-red-600 text-white hover:bg-red-700" },
  };

  const theme = portalThemes[portalType as keyof typeof portalThemes] || portalThemes.user;

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
    const role: UserRole = portalType === "restaurant" ? "restaurant" : portalType === "delivery" ? "delivery" : portalType === "admin" ? "admin" : "customer";

    let finalEmail = email.trim();
    if ((role === "restaurant" || role === "delivery") && !finalEmail.includes("@")) {
      finalEmail += "@tippay.com";
    } else if (role === "admin" && !finalEmail.includes("@")) {
      finalEmail += "@admin.com";
    }

    if (isSignup) {
      if (role === "admin") {
        toast.error("Admin accounts cannot be self-registered.");
        return;
      }
      if (role === "restaurant") {
        if (!location || !gstin) {
          toast.error("Please enter all restaurant details including Location and GSTIN.");
          return;
        }
        if (!finalEmail.endsWith("@tippay.com")) {
          toast.error("Restaurant email must end with @tippay.com");
          return;
        }
      } else if (role === "delivery") {
        if (!finalEmail.endsWith("@tippay.com")) {
          toast.error("Delivery agent email must end with @tippay.com");
          return;
        }
      }
      const result = signup(name, finalEmail, phone, password, role);
      if (result.success) {
        if (result.status === "pending") {
          toast.info("Registration successful! Your account is pending Admin approval.");
          if (role === "restaurant") {
            addAdminRestaurant({
              id: `r-new-${Date.now()}`,
              name: name,
              location: location,
              owner: name,
              email: finalEmail,
              phone: phone,
              gstin: gstin,
              image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
              category: "Pending",
              status: "pending",
              appliedDate: new Date().toISOString().split('T')[0],
            });
          }
          setIsSignup(false);
        } else {
          navigate("/home");
        }
      } else {
        toast.error("User with this email already exists.");
      }
    } else {
      const result = login(finalEmail, password);
      if (result.success) {
        const actualRole = result.role || role;
        navigate(getRedirectPath(actualRole));
      } else {
        toast.error(result.error || "Login failed.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center"
      >
        <img
          src={logo}
          alt="TIP PAY"
          className="mb-4 h-20 w-20 drop-shadow-sm select-none"
        />
        <h1 className="font-display text-3xl font-bold text-foreground text-center">{theme.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">{theme.desc}</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4"
      >
        {isSignup && portalType === "restaurant" ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Restaurant Name</Label>
              <div className="relative">
                <Store size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Spicy Kitchen" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm">Location (e.g., State or City)</Label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Karnataka, Delhi..." className="pl-9" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gstin" className="text-sm">GSTIN Number</Label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="gstin" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="e.g., 29ABCDE1234F1Z5" className="pl-9" required />
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
        ) : isSignup ? (
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
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">
            {portalType === "restaurant" ? "Restaurant Email" : "Email"}
          </Label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type={(portalType === "restaurant" || portalType === "delivery" || portalType === "admin") ? "text" : "email"} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={portalType === "admin" ? "tippay@admin.com" : (portalType === "restaurant" || portalType === "delivery") ? "name@tippay.com" : "you@example.com"} className="pl-9" required />
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

        <Button type="submit" className={`w-full ${theme.btn}`} size="lg">
          {isSignup ? "Sign Up" : "Login"}
        </Button>

        {portalType !== "admin" && (
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignup(!isSignup)} className="font-semibold text-accent underline-offset-2 hover:underline">
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default Login;
