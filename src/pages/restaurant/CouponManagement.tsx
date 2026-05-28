import { useState } from "react";
import { Plus, Ticket, Trash2, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Coupon } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const emptyCoupon: Omit<Coupon, "id"> = {
  code: "",
  discount: 0,
  type: "percentage",
  minOrderValue: 0,
  isActive: true,
  validUntil: "",
};

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const stored = localStorage.getItem("tippay_coupons");
    return stored ? JSON.parse(stored) : [];
  });

  const updateCoupons = (newCoupons: Coupon[]) => {
    localStorage.setItem("tippay_coupons", JSON.stringify(newCoupons));
    setCoupons(newCoupons);
  };
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(emptyCoupon);

  const openAdd = () => {
    setFormData({ ...emptyCoupon, validUntil: new Date().toISOString().split("T")[0] });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.code || formData.discount <= 0 || !formData.validUntil) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    const newCoupon: Coupon = {
      ...formData,
      id: `c-${Date.now()}`,
    };

    const newCoupons = [...coupons, newCoupon];
    updateCoupons(newCoupons);
    toast.success(`Coupon ${formData.code} created successfully`);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const newCoupons = coupons.filter(c => c.id !== id);
    updateCoupons(newCoupons);
    toast.success("Coupon deleted");
  };

  const toggleAvailability = (id: string) => {
    const newCoupons = coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    updateCoupons(newCoupons);
    toast.success("Coupon status updated");
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Discount Coupons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Generate and manage promotional codes</p>
        </div>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <Plus size={16} className="mr-1" />
          Create Coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
          <Ticket size={48} className="mb-4 text-muted-foreground/50" />
          <h3 className="font-display text-lg font-bold text-foreground">No active coupons</h3>
          <p className="mt-1 text-sm text-muted-foreground w-64 mx-auto">Create discount codes to attract more customers and boost sales.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div key={coupon.id} className={`flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-opacity ${!coupon.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md font-bold tracking-wider cursor-pointer" onClick={() => copyToClipboard(coupon.code)}>
                  <Ticket size={16} />
                  {coupon.code}
                  <Copy size={12} className="ml-1 opacity-50 hover:opacity-100" />
                </div>
                <Switch
                  checked={coupon.isActive}
                  onCheckedChange={() => toggleAvailability(coupon.id)}
                  className="data-[state=checked]:bg-success"
                />
              </div>

              <div className="flex-1 space-y-1 mt-2">
                <p className="text-xl font-display font-bold text-card-foreground">
                  {coupon.type === "percentage" ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                </p>
                <p className="text-xs text-muted-foreground">Min. Order: ₹{coupon.minOrderValue}</p>
                <p className="text-xs text-muted-foreground pt-1">Valid until: {new Date(coupon.validUntil).toLocaleDateString()}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <button onClick={() => handleDelete(coupon.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={(open) => { if (!open) setIsAdding(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Create Discount Coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Coupon Code *</Label>
              <Input 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s/g, "") })} 
                placeholder="e.g. SUMMER50" 
                className="uppercase tracking-wider font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                  <Label className="text-sm">Discount Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed", discount: 0 })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
               </div>
               <div className="space-y-1.5">
                <Label className="text-sm">Discount Value *</Label>
                <Input type="number" value={formData.discount || ""} onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })} placeholder={formData.type === "percentage" ? "e.g. 20" : "e.g. 150"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Min. Order Value (₹)</Label>
                <Input type="number" value={formData.minOrderValue || ""} onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })} placeholder="e.g. 499" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Valid Until *</Label>
                <Input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 pt-2 mt-4">
              <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save size={14} className="mr-1" />
                Generate Coupon
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagement;
