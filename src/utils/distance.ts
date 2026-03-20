// Haversine formula
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Generate random coordinates within a given radius (in km) from a center point
export function generateRandomCoordinates(centerLat: number, centerLng: number, radiusKm: number) {
  const r = radiusKm / 111.3;
  const w = r * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  const newLon = x / Math.cos(centerLat * (Math.PI / 180));
  
  return {
    lat: centerLat + y,
    lng: centerLng + newLon
  };
}
