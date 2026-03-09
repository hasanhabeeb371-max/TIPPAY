import { LayoutDashboard, Store, ClipboardList, Truck, Users, LogOut } from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/admin/dashboard/overview", icon: LayoutDashboard },
  { title: "Restaurants", url: "/admin/dashboard/restaurants", icon: Store },
  { title: "Orders", url: "/admin/dashboard/orders", icon: ClipboardList },
  { title: "Delivery Agents", url: "/admin/dashboard/agents", icon: Truck },
  { title: "Users", url: "/admin/dashboard/users", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "justify-center px-2" : ""}`}>
          <img src={logo} alt="TIP PAY" className="h-8 w-8" />
          {!collapsed && (
            <div className="flex-1">
              <h2 className="font-display text-sm font-bold text-foreground">TIP PAY</h2>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          )}
          <NotificationCenter className={collapsed ? "" : ""} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {!collapsed && "Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent/10"
                      activeClassName="bg-accent/15 text-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
