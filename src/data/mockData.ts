import foodBurger from "@/assets/food-burger.jpg";
import foodBiryani from "@/assets/food-biryani.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDosa from "@/assets/food-dosa.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodBeverages from "@/assets/food-beverages.jpg";
import foodChinese from "@/assets/food-chinese.jpg";
import foodIdli from "@/assets/food-idli.png";
import foodIceCream from "@/assets/food-icecream.png";
import foodSamosa from "@/assets/food-samosa.png";
import foodChickenFry from "@/assets/food-chickenfry.png";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  distance: string;
  deliveryTime: string;
  isOpen: boolean;
  menu: MenuItem[];
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  discount?: number;
  status: OrderStatus;
  date: string;
  time: string;
}

export type OrderStatus =
  | "Ordered"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Picked Up"
  | "Delivered";

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const allCategoriesNames = [
  "Idli", "Dosa", "Vada", "Upma", "Uttapam", // Breakfast / South Indian
  "Biryani", "Pulao", "Fried Rice", "Veg Meal", "Thali", "Curd Rice", // Rice & Main Meals
  "Poori", "Poori Bhaji", "Paratha", "Parotta", "Kulche", "Rolls", // Breads & Combos
  "Chicken", "Paneer", "Korma", "Dal", "Kofta", "Malai Kofta", "Mushroom Curry", "Bhurji", // Curries & Gravies
  "Pakoda", "Bhel", "Chaat", "Kebabs", "Chowmein", "Manchurian", // Snacks & Street Food
  "Omelette", "Masala Puri", "Masala Maggi", // Breakfast / Quick Bites
  "Sweets", "Gulab Jamun", "Ice Cream", "Sundae", // Desserts
  "Juice", "Milkshake", "Lassi", // Drinks
  "Soup", "Bowl" // Others
];

const genericImages = [
  foodBiryani, foodBurger, foodPizza, foodDosa, foodDessert,
  foodBeverages, foodChinese, foodIdli, foodIceCream, foodSamosa, foodChickenFry
];

const specificImages: Record<string, string> = {
  "Idli": foodIdli,
  "Dosa": foodDosa,
  "Vada": foodDosa,
  "Upma": foodDosa,
  "Uttapam": foodDosa,
  "Biryani": foodBiryani,
  "Pulao": foodBiryani,
  "Fried Rice": foodBiryani,
  "Veg Meal": foodBiryani,
  "Thali": foodBiryani,
  "Curd Rice": foodBiryani,
  "Poori": foodPizza,
  "Poori Bhaji": foodPizza,
  "Paratha": foodPizza,
  "Parotta": foodPizza,
  "Kulche": foodPizza,
  "Rolls": foodBurger,
  "Chicken": foodChickenFry,
  "Paneer": foodChickenFry,
  "Korma": foodChickenFry,
  "Dal": foodChickenFry,
  "Kofta": foodChickenFry,
  "Malai Kofta": foodChickenFry,
  "Mushroom Curry": foodChickenFry,
  "Bhurji": foodChickenFry,
  "Pakoda": foodSamosa,
  "Bhel": foodSamosa,
  "Chaat": foodSamosa,
  "Kebabs": foodChickenFry,
  "Chowmein": foodChinese,
  "Manchurian": foodChinese,
  "Omelette": foodSamosa,
  "Masala Puri": foodSamosa,
  "Masala Maggi": foodChinese,
  "Sweets": foodDessert,
  "Gulab Jamun": foodDessert,
  "Ice Cream": foodIceCream,
  "Sundae": foodIceCream,
  "Juice": foodBeverages,
  "Milkshake": foodBeverages,
  "Lassi": foodBeverages,
  "Soup": foodChinese,
  "Bowl": foodChinese
};

export const categories: Category[] = allCategoriesNames.map((name, index) => {
  const img = specificImages[name] || genericImages[index % genericImages.length];
  return { id: (index + 1).toString(), name, image: img };
});

export interface HotDeal {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  restaurantName: string;
}

export const hotDeals: HotDeal[] = [
  {
    id: "hd1",
    title: "50% OFF on Classic Burgers",
    description: "Get 50% off on all classic burgers up to ₹100",
    discount: "50% OFF",
    image: foodBurger,
    restaurantName: "Burger Palace"
  },
  {
    id: "hd2",
    title: "Flat ₹150 OFF on Pizzas",
    description: "Use code PIZZA150 on orders above ₹499",
    discount: "₹150 OFF",
    image: foodPizza,
    restaurantName: "Pizza Hub"
  },
  {
    id: "hd3",
    title: "Buy 1 Get 1 Free on Biryani",
    description: "Valid on all chicken and veg biryanis",
    discount: "BOGO",
    image: foodBiryani,
    restaurantName: "Spice Garden"
  }
];

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Burger Palace",
    image: foodBurger,
    category: "Fast Food",
    rating: 4.5,
    distance: "1.2 km",
    deliveryTime: "25-30 min",
    isOpen: true,
    menu: [
      { id: "m1", name: "Classic Cheeseburger", description: "Juicy beef patty with melted cheddar, lettuce, tomato & special sauce", price: 249, offerPrice: 199, image: foodBurger, category: "Burgers", isVeg: false },
      { id: "m2", name: "Double Stack Burger", description: "Two beef patties, double cheese, caramelized onions", price: 399, image: foodBurger, category: "Burgers", isVeg: false },
      { id: "m3", name: "Veggie Burger", description: "Crispy veggie patty with fresh vegetables and herb mayo", price: 199, image: foodBurger, category: "Burgers", isVeg: true },
      { id: "m4", name: "French Fries", description: "Crispy golden fries with seasoning", price: 99, image: foodBurger, category: "Sides", isVeg: true },
      { id: "m5", name: "Chocolate Shake", description: "Rich chocolate milkshake topped with whipped cream", price: 149, image: foodBeverages, category: "Beverages", isVeg: true },
    ],
  },
  {
    id: "r2",
    name: "Spice Garden",
    image: foodBiryani,
    category: "North Indian",
    rating: 4.3,
    distance: "2.5 km",
    deliveryTime: "35-40 min",
    isOpen: true,
    menu: [
      { id: "m6", name: "Hyderabadi Biryani", description: "Aromatic basmati rice with tender meat and saffron", price: 349, offerPrice: 299, image: foodBiryani, category: "Biryani", isVeg: false },
      { id: "m7", name: "Veg Biryani", description: "Fragrant rice with mixed vegetables and spices", price: 249, image: foodBiryani, category: "Biryani", isVeg: true },
      { id: "m8", name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 299, image: foodBiryani, category: "Curries", isVeg: false },
      { id: "m9", name: "Paneer Tikka", description: "Grilled cottage cheese with spices and peppers", price: 249, image: foodBiryani, category: "Starters", isVeg: true },
    ],
  },
  {
    id: "r3",
    name: "Pizza Hub",
    image: foodPizza,
    category: "Pizza",
    rating: 4.7,
    distance: "0.8 km",
    deliveryTime: "20-25 min",
    isOpen: true,
    menu: [
      { id: "m10", name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, basil & tomato sauce", price: 299, offerPrice: 249, image: foodPizza, category: "Pizza", isVeg: true },
      { id: "m11", name: "Pepperoni Pizza", description: "Loaded with pepperoni and mozzarella cheese", price: 399, image: foodPizza, category: "Pizza", isVeg: false },
      { id: "m12", name: "Farmhouse Pizza", description: "Bell peppers, mushrooms, onions, olives on crispy crust", price: 349, image: foodPizza, category: "Pizza", isVeg: true },
      { id: "m13", name: "Garlic Bread", description: "Toasted bread with garlic butter and herbs", price: 129, image: foodPizza, category: "Sides", isVeg: true },
    ],
  },
  {
    id: "r4",
    name: "Dosa Corner",
    image: foodDosa,
    category: "South Indian",
    rating: 4.1,
    distance: "3.1 km",
    deliveryTime: "30-35 min",
    isOpen: true,
    menu: [
      { id: "m14", name: "Masala Dosa", description: "Crispy dosa with spiced potato filling, served with chutney & sambar", price: 149, offerPrice: 119, image: foodDosa, category: "Dosa", isVeg: true },
      { id: "m15", name: "Mysore Dosa", description: "Spicy red chutney dosa with potato masala", price: 169, image: foodDosa, category: "Dosa", isVeg: true },
      { id: "m16", name: "Idli Sambar", description: "Soft steamed rice cakes with lentil soup", price: 99, image: foodDosa, category: "Breakfast", isVeg: true },
      { id: "m17", name: "Filter Coffee", description: "Traditional south Indian filter coffee", price: 49, image: foodBeverages, category: "Beverages", isVeg: true },
    ],
  },
  {
    id: "r5",
    name: "Dragon Wok",
    image: foodChinese,
    category: "Chinese",
    rating: 4.4,
    distance: "1.8 km",
    deliveryTime: "25-30 min",
    isOpen: true,
    menu: [
      { id: "m18", name: "Hakka Noodles", description: "Stir-fried noodles with vegetables and soy sauce", price: 199, offerPrice: 169, image: foodChinese, category: "Noodles", isVeg: true },
      { id: "m19", name: "Chicken Manchurian", description: "Crispy chicken in spicy Manchurian sauce", price: 249, image: foodChinese, category: "Starters", isVeg: false },
      { id: "m20", name: "Fried Rice", description: "Wok-tossed rice with vegetables and egg", price: 179, image: foodChinese, category: "Rice", isVeg: false },
      { id: "m21", name: "Spring Rolls", description: "Crispy rolls stuffed with vegetables", price: 149, image: foodChinese, category: "Starters", isVeg: true },
    ],
  },
  {
    id: "r6",
    name: "Sweet Tooth",
    image: foodDessert,
    category: "Desserts",
    rating: 4.6,
    distance: "2.0 km",
    deliveryTime: "20-25 min",
    isOpen: false,
    menu: [
      { id: "m22", name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center, served with ice cream", price: 249, offerPrice: 199, image: foodDessert, category: "Cakes", isVeg: true },
      { id: "m23", name: "Gulab Jamun", description: "Soft milk dumplings in rose-flavored sugar syrup", price: 99, image: foodDessert, category: "Indian Sweets", isVeg: true },
      { id: "m24", name: "Mango Smoothie", description: "Fresh mango blended with yogurt and honey", price: 149, image: foodBeverages, category: "Beverages", isVeg: true },
    ],
  },
];

export const mockOrders: Order[] = [
  {
    id: "TP-20260308-1001",
    restaurantName: "Burger Palace",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 199 },
      { name: "French Fries", quantity: 1, price: 99 },
    ],
    totalPrice: 497,
    status: "Delivered",
    date: "2026-03-08",
    time: "12:30 PM",
  },
  {
    id: "TP-20260308-1002",
    restaurantName: "Pizza Hub",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 249 },
      { name: "Garlic Bread", quantity: 1, price: 129 },
    ],
    totalPrice: 378,
    status: "Preparing",
    date: "2026-03-09",
    time: "1:15 PM",
  },
  {
    id: "TP-20260307-1003",
    restaurantName: "Spice Garden",
    items: [
      { name: "Hyderabadi Biryani", quantity: 1, price: 299 },
    ],
    totalPrice: 299,
    status: "Delivered",
    date: "2026-03-07",
    time: "8:00 PM",
  },
];

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrderValue: number;
  isActive: boolean;
  validUntil: string;
}

export let mockCoupons: Coupon[] = (() => {
  const stored = localStorage.getItem("tippay_coupons");
  return stored ? JSON.parse(stored) : [
    { id: "c1", code: "WELCOME50", discount: 50, type: "percentage", minOrderValue: 199, isActive: true, validUntil: "2026-12-31" },
    { id: "c2", code: "FLAT100", discount: 100, type: "fixed", minOrderValue: 499, isActive: false, validUntil: "2026-05-01" },
  ];
})();

export const saveMockCoupons = (coupons: Coupon[]) => {
  mockCoupons = coupons;
  localStorage.setItem("tippay_coupons", JSON.stringify(coupons));
};
