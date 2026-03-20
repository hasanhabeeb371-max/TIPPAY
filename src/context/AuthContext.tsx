import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "customer" | "restaurant" | "delivery" | "admin";
export type UserStatus = "active" | "pending" | "suspended";

export interface User {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinedDate?: string;
  dob?: string;
  gender?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string; role?: UserRole };
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => { success: boolean; status: UserStatus };
  logout: () => void;
  updateUserStatusByEmail: (email: string, status: UserStatus) => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectRole(email: string): UserRole {
  if (email.endsWith("@tippay.admin.com")) return "admin";
  if (email.endsWith("@tippay.agent.com")) return "delivery";
  if (email.endsWith("@tippay.restaurant.com")) return "restaurant";
  return "customer";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("tippay_users");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Super Admin", email: "tippay@admin.com", phone: "+91 9999999999", role: "admin", status: "active", joinedDate: "2025-01-01" },
      { name: "Restaurant Demo", email: "rest@tippay.restaurant.com", phone: "+91 9999999999", role: "restaurant", status: "active", joinedDate: "2025-01-01" },
      { name: "Agent Demo", email: "agent@tippay.agent.com", phone: "+91 9999999999", role: "delivery", status: "active", joinedDate: "2025-01-01" },
      { name: "Customer Demo", email: "demo@gmail.com", phone: "+91 9999999999", role: "customer", status: "active", joinedDate: "2025-01-01" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("tippay_users", JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string) => {
    if (email === "tippay@admin.com") {
      if (password !== "tippay@143") {
        return { success: false, error: "Incorrect admin password." };
      }
      setCurrentUser({ name: "Super Admin", email: "tippay@admin.com", phone: "+91 9999999999", role: "admin", status: "active", joinedDate: "2025-01-01" });
      return { success: true, role: "admin" as UserRole };
    }

    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: "User not found. Please sign up." };
    }

    if (foundUser.status === "pending") {
      return { success: false, error: "Your account is pending admin approval." };
    }
    if (foundUser.status === "suspended") {
      return { success: false, error: "Your account has been suspended." };
    }

    setCurrentUser(foundUser);
    return { success: true, role: foundUser.role };
  };

  const signup = (name: string, email: string, phone: string, _password: string, role: UserRole) => {
    if (users.some(u => u.email === email)) {
      return { success: false, status: "active" as UserStatus };
    }
    
    const status: UserStatus = (role === "restaurant" || role === "delivery") ? "pending" : "active";
    
    const newUser: User = { name, email, phone, role, status, joinedDate: new Date().toISOString().split('T')[0] };
    
    setUsers(prev => [...prev, newUser]);
    
    if (status === "active") {
      setCurrentUser(newUser);
    }
    
    return { success: true, status };
  };

  const logout = () => setCurrentUser(null);

  const updateUserStatusByEmail = (email: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status } : u));
    if (currentUser?.email === email && status !== "active") {
      logout();
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.email === currentUser.email ? { ...u, ...updates } : u));
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, users, login, signup, logout, updateUserStatusByEmail, updateUser, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
