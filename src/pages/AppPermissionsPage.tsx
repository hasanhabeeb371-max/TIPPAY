import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Search, Bell, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const AppPermissionsPage = () => {
  const navigate = useNavigate();
  
  const [location, setLocation] = useState(true);
  const [search, setSearch] = useState(true);
  const [notification, setNotification] = useState(true);
  const [liveActivities, setLiveActivities] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="font-display text-lg font-bold">App Permissions</h1>
      </div>

      <div className="px-4 mt-6">
        <p className="text-sm text-muted-foreground mb-6">
          Manage the permissions granted to this application. Changes are automatically saved.
        </p>

        <div className="space-y-4">
          <div className="flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <MapPin size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Location</p>
              <p className="text-xs text-muted-foreground">Access your location</p>
            </div>
            <Switch checked={location} onCheckedChange={setLocation} />
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Search size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Search</p>
              <p className="text-xs text-muted-foreground">Search history and nearby</p>
            </div>
            <Switch checked={search} onCheckedChange={setSearch} />
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Bell size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Notification</p>
              <p className="text-xs text-muted-foreground">Allow push notifications</p>
            </div>
            <Switch checked={notification} onCheckedChange={setNotification} />
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Activity size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Live Activities</p>
              <p className="text-xs text-muted-foreground">Show real-time updates</p>
            </div>
            <Switch checked={liveActivities} onCheckedChange={setLiveActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPermissionsPage;
