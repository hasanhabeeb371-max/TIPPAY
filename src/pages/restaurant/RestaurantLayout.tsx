import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/RestaurantSidebar";

const RestaurantLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RestaurantSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur-md">
            <SidebarTrigger className="mr-3" />
            <h1 className="font-display text-base font-semibold text-foreground">Restaurant Dashboard</h1>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RestaurantLayout;
