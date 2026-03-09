import React, { createContext, useContext, useState } from "react";

export type UserRole = "customer" | "restaurant" | "delivery" | "admin";

interface User {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectRole(email: string): UserRole {
  if (email.endsWith("@tippay.admin.com")) return "admin";
  if (email.endsWith("@tippay.agent.com")) return "delivery";
  if (email.includes("restaurant")) return "restaurant";
  return "customer";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    const role = detectRole(email);
    setUser({ name: email.split("@")[0], email, phone: "+91 9876543210", role });
  };

  const signup = (name: string, email: string, phone: string, _password: string) => {
    setUser({ name, email, phone, role: "customer" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
