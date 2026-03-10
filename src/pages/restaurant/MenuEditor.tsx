import { useState } from "react";
import { mockMenuItems, type RestaurantMenuItem } from "@/data/restaurantMockData";
import { Plus, Pencil, Trash2, Leaf, X, Save, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const emptyItem: Omit<RestaurantMenuItem, "id"> = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category: "",
  isVeg: false,
  isAvailable: true,
};

const MenuEditor = () => {
  const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>(mockMenuItems);
  const [editingItem, setEditingItem] = useState<RestaurantMenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(emptyItem);

  const categories = [...new Set(menuItems.map((i) => i.category))];

  const openAdd = () => {
    setFormData(emptyItem);
    setEditingItem(null);
    setIsAdding(true);
  };

  const openEdit = (item: RestaurantMenuItem) => {
    setFormData(item);
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...formData, id: editingItem.id } as RestaurantMenuItem : i))
      );
      toast.success(`${formData.name} updated`);
    } else {
      const newItem: RestaurantMenuItem = {
        ...formData,
        id: `m-new-${Date.now()}`,
      } as RestaurantMenuItem;
      setMenuItems((prev) => [...prev, newItem]);
      toast.success(`${formData.name} added to menu`);
    }
    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed from menu");
  };

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Menu Editor</h2>
          <p className="mt-1 text-sm text-muted-foreground">{menuItems.length} items in menu</p>
        </div>
        <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <Plus size={16} className="mr-1" />
          Add Item
        </Button>
      </div>

      {/* Menu by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{cat}</h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {menuItems
                .filter((i) => i.category === cat)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`flex items-center gap-3 rounded-xl bg-card p-3 transition-opacity ${!item.isAvailable ? "opacity-50" : ""}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                        <ImageIcon size={20} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {item.isVeg && <Leaf size={12} className="shrink-0 text-success" />}
                        <h4 className="truncate text-sm font-semibold text-card-foreground">{item.name}</h4>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-card-foreground">₹{item.offerPrice || item.price}</span>
                        {item.offerPrice && (
                          <span className="text-xs text-muted-foreground line-through">₹{item.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleAvailability(item.id)}
                        className="data-[state=checked]:bg-success"
                      />
                      <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Add/Edit Dialog */}
      <Dialog open={isAdding} onOpenChange={(open) => { if (!open) { setIsAdding(false); setEditingItem(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Item Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Classic Cheeseburger" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Price (₹) *</Label>
                <Input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="249" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Offer Price (₹)</Label>
                <Input type="number" value={formData.offerPrice || ""} onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) || undefined })} placeholder="199" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Category *</Label>
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Burgers, Sides, Beverages" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Leaf size={14} className="text-success" />
                <span className="text-sm">Vegetarian</span>
              </div>
              <Switch checked={formData.isVeg} onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => { setIsAdding(false); setEditingItem(null); }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save size={14} className="mr-1" />
                {editingItem ? "Update" : "Add Item"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuEditor;
