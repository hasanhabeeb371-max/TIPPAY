import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";


const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  
  const [enableAll, setEnableAll] = useState(false);
  const [promos, setPromos] = useState(true);
  const [social, setSocial] = useState(true);
  const [orders, setOrders] = useState(true);

  const handleEnableAll = (checked: boolean) => {
    setEnableAll(checked);
    setPromos(checked);
    setSocial(checked);
    setOrders(checked);
  };



  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="font-display text-lg font-bold">Notification Settings</h1>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Warning Header */}
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
          <BellOff size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Push Notifications OFF</p>
            <p className="text-xs mt-1 leading-relaxed opacity-90">To enable notifications, go to settings.</p>
          </div>
        </div>

        {/* Enable All */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-foreground">Enable all</p>
            <p className="text-xs text-muted-foreground mt-1">Activate all notifications</p>
          </div>
          <Switch checked={enableAll} onCheckedChange={handleEnableAll} />
        </div>

        <div className="w-full h-px bg-border hidden" />

        {/* Options */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Promos and offers</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Under Promos and offers, you can receive updates about coupons, promotions, and money-saving offers. Push notifications are turned on.
              </p>
            </div>
            <div className="pt-1">
              <Switch checked={promos} onCheckedChange={(c) => { setPromos(c); if(!c) setEnableAll(false); }} />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Social notifications</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Under Social notifications, you get notified when someone follows your profile or when you receive likes and comments on your reviews and photos. Push notifications are turned on.
              </p>
            </div>
            <div className="pt-1">
              <Switch checked={social} onCheckedChange={(c) => { setSocial(c); if(!c) setEnableAll(false); }} />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Orders and purchases</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Under Orders and purchases, you receive updates related to your order status, memberships, table bookings, and more. Push notifications are turned on.
              </p>
            </div>
            <div className="pt-1">
              <Switch checked={orders} onCheckedChange={(c) => { setOrders(c); if(!c) setEnableAll(false); }} />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default NotificationSettingsPage;
