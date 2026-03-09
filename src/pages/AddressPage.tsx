import { useState } from "react";
import { useAddress, type Address } from "@/context/AddressContext";
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Star, Trash2, Edit2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const LABEL_OPTIONS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: MapPin },
];

const AddressPage = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefault } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState("Home");
  const [fullAddress, setFullAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setLabel("Home");
    setFullAddress("");
    setLandmark("");
    setPhone("");
    setIsDefault(false);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (addr: Address) => {
    setLabel(addr.label);
    setFullAddress(addr.fullAddress);
    setLandmark(addr.landmark || "");
    setPhone(addr.phone);
    setIsDefault(addr.isDefault);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const trimmed = fullAddress.trim();
    if (!trimmed) e.fullAddress = "Address is required";
    else if (trimmed.length < 10) e.fullAddress = "Enter a complete address";
    else if (trimmed.length > 200) e.fullAddress = "Address too long";
    const trimPhone = phone.trim();
    if (!trimPhone) e.phone = "Phone is required";
    else if (!/^[\+]?[0-9\s\-]{7,15}$/.test(trimPhone)) e.phone = "Invalid phone number";
    if (landmark.length > 100) e.landmark = "Landmark too long";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      label,
      fullAddress: fullAddress.trim().slice(0, 200),
      landmark: landmark.trim().slice(0, 100) || undefined,
      phone: phone.trim().slice(0, 15),
      isDefault,
    };
    if (editingId) {
      updateAddress(editingId, data);
      toast.success("Address updated");
    } else {
      addAddress(data);
      toast.success("Address added");
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    toast.success("Address removed");
  };

  const LabelIcon = ({ l }: { l: string }) => {
    const opt = LABEL_OPTIONS.find((o) => o.value === l);
    const Icon = opt?.icon || MapPin;
    return <Icon size={16} />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-4 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-lg font-bold">Saved Addresses</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="ml-auto rounded-full bg-accent p-2 text-accent-foreground">
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="px-4">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden rounded-xl bg-card p-4"
            >
              <h3 className="font-display text-sm font-semibold text-card-foreground">
                {editingId ? "Edit Address" : "New Address"}
              </h3>

              {/* Label selector */}
              <div className="mt-3 flex gap-2">
                {LABEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLabel(opt.value)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      label === opt.value
                        ? "bg-accent text-accent-foreground"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    <opt.icon size={12} />
                    {opt.value}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <Input
                    value={fullAddress}
                    onChange={(e) => { setFullAddress(e.target.value.slice(0, 200)); setErrors((p) => ({ ...p, fullAddress: "" })); }}
                    placeholder="Full address *"
                    className="bg-background text-sm"
                  />
                  {errors.fullAddress && <p className="mt-1 text-xs text-destructive">{errors.fullAddress}</p>}
                </div>
                <div>
                  <Input
                    value={landmark}
                    onChange={(e) => { setLandmark(e.target.value.slice(0, 100)); setErrors((p) => ({ ...p, landmark: "" })); }}
                    placeholder="Landmark (optional)"
                    className="bg-background text-sm"
                  />
                  {errors.landmark && <p className="mt-1 text-xs text-destructive">{errors.landmark}</p>}
                </div>
                <div>
                  <Input
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.slice(0, 15)); setErrors((p) => ({ ...p, phone: "" })); }}
                    placeholder="Phone number *"
                    className="bg-background text-sm"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-accent"
                  />
                  Set as default address
                </label>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={resetForm} variant="outline" size="sm" className="flex-1 text-xs">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="flex-1 bg-accent text-xs text-accent-foreground hover:bg-accent/90">
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        <AnimatePresence mode="popLayout">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className={`mb-3 rounded-xl bg-card p-4 ${addr.isDefault ? "ring-2 ring-accent/40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${addr.isDefault ? "bg-accent/20 text-accent-foreground" : "bg-background text-muted-foreground"}`}>
                  <LabelIcon l={addr.label} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-card-foreground">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="flex items-center gap-0.5 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                        <Star size={8} className="fill-accent text-accent" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{addr.fullAddress}</p>
                  {addr.landmark && <p className="text-xs text-muted-foreground/70">📍 {addr.landmark}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">📞 {addr.phone}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                {!addr.isDefault && (
                  <button
                    onClick={() => { setDefault(addr.id); toast.success("Default address updated"); }}
                    className="flex items-center gap-1 rounded-full bg-background px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent/10"
                  >
                    <Check size={10} /> Set Default
                  </button>
                )}
                <button
                  onClick={() => startEdit(addr)}
                  className="flex items-center gap-1 rounded-full bg-background px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent/10"
                >
                  <Edit2 size={10} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="ml-auto flex items-center gap-1 rounded-full bg-background px-3 py-1.5 text-[10px] font-medium text-destructive/70 transition-colors hover:bg-destructive/10"
                >
                  <Trash2 size={10} /> Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {addresses.length === 0 && !showForm && (
          <div className="flex flex-col items-center pt-20 text-center">
            <MapPin size={48} className="text-muted-foreground/30" />
            <p className="mt-3 font-display text-sm font-semibold text-muted-foreground">No saved addresses</p>
            <Button onClick={() => setShowForm(true)} size="sm" className="mt-4 bg-accent text-accent-foreground">
              Add Address
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default AddressPage;
