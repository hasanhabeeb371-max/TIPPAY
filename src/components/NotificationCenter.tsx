import { forwardRef } from "react";
import { Bell, Check, CheckCheck, Trash2, Package, Tag, AlertTriangle, Info, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, type Notification } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const typeConfig: Record<Notification["type"], { icon: typeof Bell; color: string }> = {
  order: { icon: Package, color: "text-blue-500" },
  promo: { icon: Tag, color: "text-accent" },
  system: { icon: Info, color: "text-muted-foreground" },
  delivery: { icon: Truck, color: "text-green-500" },
  alert: { icon: AlertTriangle, color: "text-destructive" },
};

const NotificationItem = forwardRef<HTMLButtonElement, { notification: Notification; onRead: (id: string) => void }>(
  ({ notification, onRead }, ref) => {
  const { icon: Icon, color } = typeConfig[notification.type];

  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={() => onRead(notification.id)}
      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/50 ${!notification.read ? "bg-accent/5" : ""}`}
    >
      <div className={`mt-0.5 rounded-lg bg-muted p-2 ${color}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm ${!notification.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
            {notification.title}
          </p>
          {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
        <p className="mt-1 text-[10px] text-muted-foreground/60">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
        </p>
      </div>
    </motion.button>
  );
});
NotificationItem.displayName = "NotificationItem";

interface NotificationBellProps {
  className?: string;
}

const NotificationCenter = ({ className = "" }: NotificationBellProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className={`relative p-2 rounded-lg transition-colors hover:bg-muted/50 ${className}`}>
          <Bell size={20} className="text-foreground" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full max-w-md flex-col p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-foreground">Notifications</SheetTitle>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 gap-1 text-xs text-muted-foreground">
                  <CheckCheck size={14} />
                  Read all
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 gap-1 text-xs text-muted-foreground">
                  <Trash2 size={14} />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 px-3 py-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell size={40} className="mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No notifications</p>
              <p className="mt-1 text-xs text-muted-foreground/60">You're all caught up!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
