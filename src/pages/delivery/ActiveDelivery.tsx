import { useState, useEffect, useRef } from "react";
import type { DeliveryOrder } from "@/types/models";
import { optimizeRoutes, type RouteWaypoint } from "@/utils/routeOptimizer";
import { MapPin, Phone, Store, Navigation, CheckCircle2, Package, Truck, ClipboardCheck, ArrowRight, Gauge, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ActiveDelivery = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    const saved = localStorage.getItem("tippay_delivery_orders");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Active accepted orders (rider carries these)
  const activeOrders = orders.filter((o) => o.status === "Picked Up");

  // Load optimized route
  const { route, totalDistanceKm, totalDurationMins, fuelSavedPct } = optimizeRoutes(activeOrders);

  // Track progress along route waypoints (index 0 is Rider Start)
  const [currentWpIndex, setCurrentWpIndex] = useState(1);
  const [showPickupDialog, setShowPickupDialog] = useState(false);
  const [pickupCode, setPickupCode] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Dash offset for animating lines
  const [dashOffset, setDashOffset] = useState(0);

  // Sync to local storage
  const saveOrders = (updatedOrders: DeliveryOrder[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("tippay_delivery_orders", JSON.stringify(updatedOrders));
  };

  // Canvas map drawing effect
  useEffect(() => {
    if (route.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // Map boundary logic
    const lats = route.map(r => r.lat);
    const lngs = route.map(r => r.lng);
    const minLat = Math.min(...lats) - 0.005;
    const maxLat = Math.max(...lats) + 0.005;
    const minLng = Math.min(...lngs) - 0.005;
    const maxLng = Math.max(...lngs) + 0.005;

    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;

    const project = (lat: number, lng: number) => {
      // Flip Y because canvas 0,0 is top-left, and higher lat is north (up)
      const x = ((lng - minLng) / lngSpan) * (canvas.width - 40) + 20;
      const y = canvas.height - (((lat - minLat) / latSpan) * (canvas.height - 40) + 20);
      return { x, y };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines for tactical tech style
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 20; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 20; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Route Path connecting waypoints in optimized sequence
      ctx.strokeStyle = "rgba(183, 59, 254, 0.6)"; // accent color
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -dashOffset;

      ctx.beginPath();
      const start = project(route[0].lat, route[0].lng);
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < route.length; i++) {
        const pt = project(route[i].lat, route[i].lng);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Reset dash
      ctx.setLineDash([]);

      // Draw Waypoints (Nodes)
      route.forEach((wp, idx) => {
        const pt = project(wp.lat, wp.lng);
        const isCurrent = idx === currentWpIndex;
        const isVisited = idx < currentWpIndex;

        if (wp.type === "rider") {
          // Rider location
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#3b82f6";
          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (wp.type === "pickup") {
          // Restaurant node
          ctx.shadowBlur = isCurrent ? 12 : 4;
          ctx.shadowColor = "#f59e0b";
          ctx.fillStyle = isVisited ? "rgba(245, 158, 11, 0.4)" : "#f59e0b";
          
          ctx.beginPath();
          ctx.rect(pt.x - 7, pt.y - 7, 14, 14);
          ctx.fill();
          ctx.strokeStyle = isCurrent ? "#ffffff" : "#f59e0b";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Sequence label
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`R${idx}`, pt.x, pt.y - 10);
        } else {
          // Customer drop node
          ctx.shadowBlur = isCurrent ? 12 : 4;
          ctx.shadowColor = "#ef4444";
          ctx.fillStyle = isVisited ? "rgba(239, 68, 68, 0.4)" : "#ef4444";
          
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = isCurrent ? "#ffffff" : "#ef4444";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Sequence label
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`C${idx}`, pt.x, pt.y - 10);
        }
      });

      // Simple animation step
      setDashOffset(prev => (prev + 0.5) % 14);
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [route, currentWpIndex, dashOffset]);

  if (activeOrders.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="font-display text-xl font-bold text-foreground">Active Delivery Batch</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your current delivery assignments</p>
        </div>
        <div className="flex flex-col items-center py-20 bg-card rounded-2xl border border-border/40">
          <Truck size={56} className="text-muted-foreground/30 animate-bounce" />
          <p className="mt-4 font-display text-base font-semibold text-muted-foreground">No active deliveries</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Go to Nearby Orders and accept up to 3 orders.</p>
        </div>
      </div>
    );
  }

  // Current waypoint the rider is navigating to
  const currentWaypoint: RouteWaypoint | undefined = route[currentWpIndex];
  const isFinished = currentWpIndex >= route.length;

  const handleArrived = () => {
    if (!currentWaypoint) return;
    if (currentWaypoint.type === "pickup") {
      setShowPickupDialog(true);
    } else if (currentWaypoint.type === "drop") {
      // Mark as delivered
      toast.success(`Delivered successfully to ${currentWaypoint.name}! 🎉`);
      
      // Update order status in local storage
      const updated = orders.map((o) =>
        o.id === currentWaypoint.orderId ? { ...o, status: "Delivered" as const } : o
      );
      saveOrders(updated);

      // Advance waypoint index
      setCurrentWpIndex(prev => prev + 1);
    }
  };

  const handleConfirmPickup = () => {
    if (!pickupCode.trim()) {
      toast.error("Please enter the Order ID");
      return;
    }
    if (currentWaypoint && pickupCode.trim().toUpperCase() === currentWaypoint.orderId) {
      setShowPickupDialog(false);
      setPickupCode("");
      
      toast.success(`Order ${currentWaypoint.orderId} picked up! Next waypoint loaded.`);

      // Advance waypoint
      setCurrentWpIndex(prev => prev + 1);
    } else {
      toast.error("Invalid Order ID code. Please check and try again.");
    }
  };

  return (
    <div className="pb-16">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Route Optimizer</h2>
          <p className="mt-1 text-sm text-muted-foreground">Batch Delivery Optimization ({activeOrders.length} active orders)</p>
        </div>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent animate-pulse">
          TSP Mode Active
        </span>
      </div>

      {/* Optimization Analytics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card border border-border/40 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
            <Milestone size={11} className="text-accent" /> Distance
          </span>
          <span className="text-base font-extrabold text-foreground mt-1">{totalDistanceKm} km</span>
        </div>
        <div className="bg-card border border-border/40 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
            <Clock size={11} className="text-info" /> Est. Time
          </span>
          <span className="text-base font-extrabold text-foreground mt-1">{totalDurationMins} mins</span>
        </div>
        <div className="bg-card border border-border/40 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
            <Gauge size={11} className="text-success" /> Fuel Saved
          </span>
          <span className="text-base font-extrabold text-success mt-1">🌿 {fuelSavedPct}%</span>
        </div>
      </div>

      {/* Interactive Map Visual */}
      <div className="mb-6 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-inner relative">
        <canvas
          ref={canvasRef}
          width={360}
          height={240}
          className="w-full bg-slate-950 rounded-xl"
        />
        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-400 space-y-0.5">
          <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Rider (Start)</p>
          <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-amber-500 inline-block"></span> Pickup Store</p>
          <p className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block"></span> Drop Customer</p>
        </div>
      </div>

      {/* Route Execution Queue */}
      <div className="space-y-4">
        <h3 className="font-display text-sm font-bold text-foreground">Optimal Route Queue</h3>
        
        <div className="relative border-l border-border/30 ml-3.5 space-y-4">
          {route.slice(1).map((wp, idx) => {
            const seqIndex = idx + 1;
            const isCurrent = seqIndex === currentWpIndex;
            const isCompleted = seqIndex < currentWpIndex;
            
            return (
              <div key={wp.id} className="relative pl-6">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-extrabold ${
                    isCurrent
                      ? "bg-accent text-accent-foreground border-accent scale-110 shadow-md"
                      : isCompleted
                      ? "bg-success text-success-foreground border-success"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {isCompleted ? "✓" : seqIndex}
                </div>

                <div className={`p-3 rounded-xl border ${isCurrent ? "border-accent bg-accent/5" : "border-border/20 bg-card"} transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                      {wp.type === "pickup" ? <Store size={10} className="text-amber-500" /> : <MapPin size={10} className="text-red-500" />}
                      {wp.type === "pickup" ? "PICKUP" : "DROP-OFF"}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">Order: {wp.orderId}</span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground mt-1">{wp.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{wp.address}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-gradient-to-t from-background via-background/90 to-transparent z-40">
        {!isFinished && currentWaypoint ? (
          <Button
            onClick={handleArrived}
            className={`w-full font-bold shadow-xl py-4 h-12 text-sm ${
              currentWaypoint.type === "pickup"
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-success hover:bg-success/90 text-white"
            }`}
          >
            {currentWaypoint.type === "pickup" ? (
              <>
                <Store size={16} className="mr-2" />
                Arrived at Restaurant (Pickup {currentWaypoint.orderId})
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Arrived at Customer (Deliver {currentWaypoint.orderId})
              </>
            )}
          </Button>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="rounded-xl bg-success/15 border border-success/30 p-3 text-center"
          >
            <CheckCircle2 size={24} className="text-success mx-auto mb-1 animate-bounce" />
            <p className="text-xs font-bold text-success">Batch Deliveries Completed!</p>
            <p className="text-[10px] text-muted-foreground">All active route nodes cleared. Scan nearby orders to accept more.</p>
          </motion.div>
        )}
      </div>

      {/* Confirm Pickup Dialog */}
      <Dialog open={showPickupDialog} onOpenChange={setShowPickupDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold">Confirm Restaurant Pickup</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Please verify the order items and type the Order ID code to confirm pickup:
          </p>
          {currentWaypoint && (
            <div className="bg-muted p-3.5 rounded-lg border my-2 text-xs">
              <p className="font-bold">Order: {currentWaypoint.orderId}</p>
              <p className="text-muted-foreground mt-0.5">{currentWaypoint.address}</p>
            </div>
          )}
          <Input
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            placeholder="e.g. TP-20260309-3001"
            className="mt-2 font-mono text-xs uppercase"
          />
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPickupDialog(false)} className="flex-1 text-xs">Cancel</Button>
            <Button onClick={handleConfirmPickup} size="sm" className="flex-1 bg-accent text-accent-foreground font-bold hover:brightness-105 text-xs">
              Confirm Pickup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDelivery;
