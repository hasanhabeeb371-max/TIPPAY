import type { AdminRestaurant, RestaurantMenuItem } from "@/types/models";

const restaurantId = "rest-kadupuninda-001";

export const seedKadupunindaRestaurant: AdminRestaurant = {
  id: restaurantId,
  name: "Kadupuninda",
  image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop", // South Indian Thali
  owner: "Kadupuninda Management",
  email: "kadupuninda@tippay.com",
  phone: "9346763022",
  location: "Hyderabad",
  gstin: "22AAAAA0000A1Z5",
  category: "South Indian",
  status: "approved",
  appliedDate: new Date().toISOString().split("T")[0],
  lat: 17.3850,
  lng: 78.4867,
};

const createMenuItem = (
  name: string,
  price: number,
  category: string,
  description: string = "",
  image: string = "https://images.unsplash.com/photo-1626082895617-2c63380b2a8c?q=80&w=2070&auto=format&fit=crop"
): RestaurantMenuItem => ({
  id: `item-${restaurantId}-${name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
  restaurantId,
  name,
  description: description || `Delicious homemade ${name}`,
  price,
  image,
  category,
  isVeg: true,
  isAvailable: true,
});

export const seedKadupunindaMenu: RestaurantMenuItem[] = [
  // Pachadi Annam (Assume Box 500ml - ₹100 based on Podi Annam note)
  createMenuItem("Gongura Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Tomato Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Nimmakaya Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Mamidikaya Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Pandu Mirapa Palla Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Allam Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Mulakkada Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Kothimeera Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Chinthakaya Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Usiri Pachadi Annam", 100, "Pachadi Annam", "", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),

  // Podi Annam (Box 500ml - ₹100)
  createMenuItem("Karivepaku Podi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Kakarkai Podi with Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Munagaku Podi with Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Velluli Karam Chilli Garlic Podi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Palli Podi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Nuvvula Podi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Kandi Podi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("UsiriPodi Neyyi Annam", 100, "Podi Annam", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),

  // Wow Box
  createMenuItem("Any 2 Rice Boxes (500ml + 300ml)", 120, "Wow Box", "Choose from Pulihora, Sambar Rice, Curd Rice", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Any 2 Rice Boxes Premium (500ml + 300ml)", 140, "Wow Box", "Choose from any rice items", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop"),

  // Rice Items
  createMenuItem("Annam (500ml)", 50, "Rice Items", "Plain White Rice", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Curd Rice (500ml)", 80, "Rice Items", "", "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Peanut Pulihora (500ml)", 80, "Rice Items", "", "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Nuvvula Pulihora (500ml)", 90, "Rice Items", "", "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Kaju Pulihora (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Daddojanam (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Muddapappu Neyyi Avakai (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Pepper Rice (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Jeera Rice (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Vamu Annam (500ml)", 100, "Rice Items", "", "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=600&auto=format&fit=crop"),

  // Sambar & Dal Items
  createMenuItem("Sambar Annam (500ml)", 80, "Sambar & Dal", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Sambar Annam with Neyyi (500ml)", 90, "Sambar & Dal", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Pappu Annam (500ml)", 100, "Sambar & Dal", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),

  // Curries
  createMenuItem("Any Rotie Pachadi", 20, "Curries", "Daily special fresh pachadi", "https://images.unsplash.com/photo-1626545758257-2e11a2f64dff?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Any Vepudu", 40, "Curries", "Daily special fry", "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Any Curry", 40, "Curries", "Daily special curry", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Sambar", 40, "Curries", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Pachi Pulusu", 40, "Curries", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Miryala Rasam", 40, "Curries", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Dal", 50, "Curries", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),
  createMenuItem("Paneer and Vankay", 50, "Curries", "", "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?q=80&w=600&auto=format&fit=crop"),

  // Roti
  createMenuItem("Phulka", 10, "Roti", "Fresh soft phulka", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop"),
  createMenuItem("Oil Phulka", 12, "Roti", "Soft phulka with oil", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop"),
  createMenuItem("Ghee Phulka", 15, "Roti", "Soft phulka with pure ghee", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop"),
  createMenuItem("3 Phulka with Curry", 70, "Roti", "3 soft phulkas served with daily curry", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop"),
  createMenuItem("3 Phulka with Dal", 80, "Roti", "3 soft phulkas served with dal", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop"),

  // Combos
  createMenuItem("Single Pack (500ml)", 220, "Combos", "Pulihora, Sambar Rice, Curd Rice", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Mini Single Pack (300ml)", 150, "Combos", "Pulihora, Sambar Rice, Curd Rice", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Office Pack (500ml)", 300, "Combos", "Pulihora, Sambar Rice, Any Pachadi Annam, Curd Rice", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Mini Office Pack (300ml)", 180, "Combos", "Pulihora, Sambar Rice, Any Pachadi Annam, Curd Rice", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Special Meal", 230, "Combos", "Pulihora, Dhadhojanam, 2 Bellam Chapathi", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Kadupuninda Meal (500ml)", 480, "Combos", "Pulihora, Sambar Rice, Any Pachadi Annam, Curd Rice, White Rice, Dal, Curry, 4 Pulkas", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Mini Kadupuninda Meal (300ml)", 340, "Combos", "Pulihora, Sambar Rice, Any Pachadi Annam, Curd Rice, White Rice, Dal, Curry, 2 Pulkas", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop"),
  createMenuItem("Budget Meal Tray", 150, "Combos", "Rice, Dal, Curry, Sambar, Pachadi", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"),

  // Home Made Sweets
  createMenuItem("2 Bellam Chapathi with Ghee", 70, "Home Made Sweets", "Sweet chapathi made with jaggery", "https://images.unsplash.com/photo-1599598425947-330026217431?q=80&w=2069&auto=format&fit=crop"),
  createMenuItem("2 Panchadara Chapathi with Ghee", 70, "Home Made Sweets", "Sweet chapathi made with sugar", "https://images.unsplash.com/photo-1599598425947-330026217431?q=80&w=2069&auto=format&fit=crop"),
  createMenuItem("Any Sweet (Only on Festivals)", 70, "Home Made Sweets", "Special festival sweet"),

  // Catering Services
  createMenuItem("Party Orders Catering", 1000, "Catering Services", "Contact 9346763022, 8885588252 for detailed pricing"),
  createMenuItem("Corporate Catering", 2000, "Catering Services", "Contact 9346763022, 8885588252 for detailed pricing"),
  createMenuItem("Full-Service Event Catering", 5000, "Catering Services", "Contact 9346763022, 8885588252 for detailed pricing"),
];
