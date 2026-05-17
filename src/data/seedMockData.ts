import { restaurants as mockRestaurants } from "@/data/mockData";
import { adminRestaurants as adminMockRestaurants } from "@/data/adminMockData";
import { mockMenuItems } from "@/data/restaurantMockData";
import type { AdminRestaurant } from "@/data/adminMockData";
import type { RestaurantMenuItem } from "@/data/restaurantMockData";

const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;

/** Approved customer restaurants + pending/suspended rows for the admin panel. */
export function getSeedAdminRestaurants(): AdminRestaurant[] {
  const approved = mockRestaurants.map((r, i) => {
    const meta = adminMockRestaurants.find((a) => a.name === r.name);
    return {
      id: r.id,
      name: r.name,
      image: r.image,
      owner: meta?.owner ?? "Demo Owner",
      email: meta?.email ?? `owner-${r.id}@tippay.restaurant.com`,
      phone: meta?.phone ?? "+91 9876543210",
      location: meta?.location ?? "Karnataka",
      gstin: meta?.gstin ?? "29ABCDE1234F1Z5",
      category: r.category,
      status: "approved" as const,
      appliedDate: meta?.appliedDate ?? "2025-12-15",
      lat: BASE_LAT + i * 0.008,
      lng: BASE_LNG + i * 0.008,
    };
  });

  const extras = adminMockRestaurants.filter(
    (a) => a.status !== "approved" && !mockRestaurants.some((r) => r.name === a.name)
  );

  return [...approved, ...extras];
}

export function getSeedMenuItems(): RestaurantMenuItem[] {
  const fromCatalog = mockRestaurants.flatMap((r) =>
    r.menu.map((m) => ({
      ...m,
      isAvailable: true,
    }))
  );

  const ids = new Set(fromCatalog.map((m) => m.id));
  const extras = mockMenuItems.filter((m) => !ids.has(m.id));
  return [...fromCatalog, ...extras];
}
