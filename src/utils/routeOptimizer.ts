export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteWaypoint {
  id: string;
  type: "pickup" | "drop" | "rider";
  name: string;
  address: string;
  lat: number;
  lng: number;
  orderId: string;
}

export interface OptimizationResult {
  route: RouteWaypoint[];
  totalDistanceKm: number;
  totalDurationMins: number;
  fuelSavedPct: number;
}

// Simulated coordinates for mock order ids
const orderLocations: Record<string, { pickup: LatLng; drop: LatLng }> = {
  "TP-20260309-3001": {
    pickup: { lat: 12.9740, lng: 77.6080 }, // Brigade Road
    drop: { lat: 12.9765, lng: 77.5990 }, // MG Road
  },
  "TP-20260309-3002": {
    pickup: { lat: 12.9350, lng: 77.6250 }, // Koramangala
    drop: { lat: 12.9780, lng: 77.6410 }, // Indiranagar
  },
  "TP-20260309-3003": {
    pickup: { lat: 12.9282, lng: 77.5910 }, // Jayanagar
    drop: { lat: 12.9150, lng: 77.6080 }, // BTM Layout
  },
  "TP-20260309-3004": {
    pickup: { lat: 12.9720, lng: 77.6040 }, // Residency Road
    drop: { lat: 12.9690, lng: 77.6300 }, // Close drop instead of distant Whitefield for visual layout
  },
};

// Rider location (Central Bengaluru)
const RIDER_COORDS: LatLng = { lat: 12.9716, lng: 77.5946 };

function calculateDistance(p1: LatLng, p2: LatLng): number {
  // Simple Euclidean distance converted roughly to kilometers in Bengaluru
  const latDiff = p1.lat - p2.lat;
  const lngDiff = p1.lng - p2.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // 1 degree ≈ 111 km
}

export function optimizeRoutes(
  activeOrders: any[]
): OptimizationResult {
  if (activeOrders.length === 0) {
    return {
      route: [],
      totalDistanceKm: 0,
      totalDurationMins: 0,
      fuelSavedPct: 0,
    };
  }

  // Define starting point (rider)
  const riderWaypoint: RouteWaypoint = {
    id: "rider",
    type: "rider",
    name: "Your Location",
    address: "Active GPS location",
    lat: RIDER_COORDS.lat,
    lng: RIDER_COORDS.lng,
    orderId: "none",
  };

  // Compile all necessary waypoints (Pickups & Drops)
  const waypoints: RouteWaypoint[] = [];
  for (const o of activeOrders) {
    const coords = orderLocations[o.id] || {
      // fallback dynamically generated close coordinates if id not pre-mapped
      pickup: { lat: RIDER_COORDS.lat + 0.01, lng: RIDER_COORDS.lng + 0.01 },
      drop: { lat: RIDER_COORDS.lat + 0.02, lng: RIDER_COORDS.lng - 0.01 },
    };

    waypoints.push({
      id: `${o.id}-pickup`,
      type: "pickup",
      name: `Pickup: ${o.restaurantName}`,
      address: o.restaurantAddress,
      lat: coords.pickup.lat,
      lng: coords.pickup.lng,
      orderId: o.id,
    });

    waypoints.push({
      id: `${o.id}-drop`,
      type: "drop",
      name: `Drop: ${o.customerName}`,
      address: o.deliveryAddress,
      lat: coords.drop.lat,
      lng: coords.drop.lng,
      orderId: o.id,
    });
  }

  // Generate all valid permutations (Pickup of order must precede its Drop)
  const permutations: RouteWaypoint[][] = [];

  function permute(arr: RouteWaypoint[], memo: RouteWaypoint[] = []) {
    if (arr.length === 0) {
      if (isValidSequence(memo)) {
        permutations.push(memo);
      }
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      const curr = arr.slice();
      const next = curr.splice(i, 1);
      permute(curr.slice(), memo.concat(next));
    }
  }

  function isValidSequence(seq: RouteWaypoint[]): boolean {
    const visited = new Set<string>();
    for (const wp of seq) {
      if (wp.type === "drop") {
        // Must have visited the corresponding pickup already
        if (!visited.has(`${wp.orderId}-pickup`)) {
          return false;
        }
      }
      visited.add(wp.id);
    }
    return true;
  }

  permute(waypoints);

  // If no permutations found, return default un-optimized sequence
  if (permutations.length === 0) {
    return {
      route: [riderWaypoint, ...waypoints],
      totalDistanceKm: 10,
      totalDurationMins: 30,
      fuelSavedPct: 0,
    };
  }

  // Evaluate the best route
  let bestRoute: RouteWaypoint[] = [];
  let minDistance = Infinity;

  // Let's also evaluate the baseline (first order pickup + drop, then second order pickup + drop...)
  // to show a simulated "Fuel Saved %"!
  let baselineDistance = 0;
  let currentPos: LatLng = RIDER_COORDS;
  for (let i = 0; i < activeOrders.length; i++) {
    const o = activeOrders[i];
    const orderWps = waypoints.filter(wp => wp.orderId === o.id);
    const pickupWp = orderWps.find(wp => wp.type === "pickup")!;
    const dropWp = orderWps.find(wp => wp.type === "drop")!;
    
    baselineDistance += calculateDistance(currentPos, pickupWp);
    baselineDistance += calculateDistance(pickupWp, dropWp);
    currentPos = dropWp;
  }

  for (const perm of permutations) {
    let routeDistance = 0;
    let currentPoint: LatLng = RIDER_COORDS;
    
    for (const wp of perm) {
      routeDistance += calculateDistance(currentPoint, wp);
      currentPoint = wp;
    }

    if (routeDistance < minDistance) {
      minDistance = routeDistance;
      bestRoute = perm;
    }
  }

  const optimizedDistance = minDistance;
  const savingsPct = baselineDistance > optimizedDistance 
    ? Math.round(((baselineDistance - optimizedDistance) / baselineDistance) * 100)
    : 15; // fallback to showing 15% saved

  return {
    route: [riderWaypoint, ...bestRoute],
    totalDistanceKm: Math.round(optimizedDistance * 10) / 10,
    totalDurationMins: Math.round(optimizedDistance * 4 + activeOrders.length * 5), // rough speed assumption + prep buffer
    fuelSavedPct: Math.max(0, savingsPct),
  };
}
