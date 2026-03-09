import { useState } from "react";
import { adminRestaurants, type AdminRestaurant } from "@/data/adminMockData";
import { Check, X, Ban, Eye, MapPin, Mail, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const statusBadge: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-warning/15 text-warning" },
  approved: { label: "Active", cls: "bg-success/15 text-success" },
  suspended: { label: "Suspended", cls: "bg-destructive/15 text-destructive" },
};

const tabs = ["All", "Pending", "Approved", "Suspended"] as const;

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(adminRestaurants);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const [viewing, setViewing] = useState<AdminRestaurant | null>(null);

  const filtered = restaurants.filter(
    (r) => activeTab === "All" || r.status === activeTab.toLowerCase()
  );

  const updateStatus = (id: string, status: AdminRestaurant["status"]) => {
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const actionMap = { approved: "approved", suspended: "suspended", pending: "set to pending" };
    toast.success(`Restaurant ${actionMap[status]}`);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Restaurant Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {restaurants.filter((r) => r.status === "pending").length} pending approvals
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-card p-1">
        {tabs.map((tab) => {
          const count = tab === "All" ? restaurants.length : restaurants.filter((r) => r.status === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
                activeTab === tab ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((r) => {
            const badge = statusBadge[r.status];
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-3 rounded-xl bg-card p-4"
              >
                <img src={r.image} alt={r.name} className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-sm font-semibold text-card-foreground">{r.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.category} · {r.owner}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={10} />{r.location} · Applied {r.appliedDate}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setViewing(r)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Eye size={14} /></button>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "approved")} className="rounded-lg p-2 text-success hover:bg-success/10"><Check size={14} /></button>
                      <button onClick={() => updateStatus(r.id, "suspended")} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><X size={14} /></button>
                    </>
                  )}
                  {r.status === "approved" && (
                    <button onClick={() => updateStatus(r.id, "suspended")} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Ban size={14} /></button>
                  )}
                  {r.status === "suspended" && (
                    <button onClick={() => updateStatus(r.id, "approved")} className="rounded-lg p-2 text-success hover:bg-success/10"><Check size={14} /></button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Restaurant Details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <img src={viewing.image} alt={viewing.name} className="h-16 w-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-display text-base font-bold">{viewing.name}</h3>
                  <p className="text-xs text-muted-foreground">{viewing.category}</p>
                </div>
              </div>
              {[
                { icon: FileText, label: "Owner", value: viewing.owner },
                { icon: Mail, label: "Email", value: viewing.email },
                { icon: Phone, label: "Phone", value: viewing.phone },
                { icon: MapPin, label: "Location", value: viewing.location },
                { icon: FileText, label: "GSTIN", value: viewing.gstin },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <f.icon size={14} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{f.label}</p>
                    <p className="text-sm text-foreground">{f.value}</p>
                  </div>
                </div>
              ))}
              {viewing.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => { updateStatus(viewing.id, "suspended"); setViewing(null); }} className="flex-1 border-destructive/30 text-destructive">Reject</Button>
                  <Button onClick={() => { updateStatus(viewing.id, "approved"); setViewing(null); }} className="flex-1 bg-primary text-primary-foreground">Approve</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRestaurants;
