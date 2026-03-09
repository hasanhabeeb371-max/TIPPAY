import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import RestaurantLayout from "./pages/restaurant/RestaurantLayout";
import OrderManagement from "./pages/restaurant/OrderManagement";
import MenuEditor from "./pages/restaurant/MenuEditor";
import RestaurantAnalytics from "./pages/restaurant/RestaurantAnalytics";
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import NearbyOrders from "./pages/delivery/NearbyOrders";
import ActiveDelivery from "./pages/delivery/ActiveDelivery";
import DeliveryStats from "./pages/delivery/DeliveryStats";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthRoute><Login /></AuthRoute>} />
    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

    {/* Restaurant Dashboard */}
    <Route path="/restaurant/dashboard" element={<ProtectedRoute><RestaurantLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="orders" replace />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="menu" element={<MenuEditor />} />
      <Route path="analytics" element={<RestaurantAnalytics />} />
    </Route>

    {/* Delivery Agent Dashboard */}
    <Route path="/delivery/dashboard" element={<ProtectedRoute><DeliveryLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="orders" replace />} />
      <Route path="orders" element={<NearbyOrders />} />
      <Route path="active" element={<ActiveDelivery />} />
      <Route path="stats" element={<DeliveryStats />} />
      <Route path="profile" element={<DeliveryProfile />} />
    </Route>

    {/* Admin Dashboard */}
    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<AdminOverview />} />
      <Route path="restaurants" element={<AdminRestaurants />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="agents" element={<AdminAgents />} />
      <Route path="users" element={<AdminUsers />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
