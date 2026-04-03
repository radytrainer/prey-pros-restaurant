import { MenuItem } from './types';

export const SAMPLE_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  // Breakfast - Morning
  {
    name: "បាយសាច់ជ្រូក",
    description: "Grilled pork marinated in coconut milk and garlic, served with rice and pickled vegetables.",
    price: 2.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400&h=300&fit=crop",
    ingredients: [{ name: "Pork", quantity: 0.2, unit: "kg" }, { name: "Rice", quantity: 0.3, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "គុយទាវ",
    description: "Traditional rice noodle soup with pork bone broth, minced pork, and fresh herbs.",
    price: 3.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1569870499705-504209102861?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Pork", quantity: 0.1, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "នំបញ្ចុក",
    description: "Rice noodles topped with a green fish gravy and fresh seasonal vegetables.",
    price: 2.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "បបរមាន់",
    description: "Savory rice porridge with chicken, ginger, and crispy fried garlic.",
    price: 1.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice", quantity: 0.1, unit: "kg" }, { name: "Chicken", quantity: 0.1, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "នំបុ័ងសាច់ជ្រូក",
    description: "Baguette filled with pâté, pickled papaya, and grilled pork.",
    price: 1.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1600454021970-351feb4a47e7?w=400&h=300&fit=crop",
    ingredients: [{ name: "Baguette", quantity: 1, unit: "pcs" }, { name: "Pork", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  {
    name: "គុយទាវខសាច់គោ",
    description: "Rich beef stew noodle soup with carrots and herbs, served with bread or noodles.",
    price: 3.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.15, unit: "kg" }, { name: "Carrots", quantity: 50, unit: "g" }],
    isAvailable: true
  },

  // Lunch - Afternoon
  {
    name: "អាម៉ុកត្រី",
    description: "Steamed fish curry with coconut milk and kroeung, served in a banana leaf box.",
    price: 4.50,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fish", quantity: 0.2, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "ឡុកឡាក់សាច់គោ",
    description: "Stir-fried beef in a savory sauce, served with lime-pepper dipping sauce and rice.",
    price: 5.00,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.2, unit: "kg" }, { name: "Rice", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "សម្លកកូរ",
    description: "Traditional Khmer vegetable stew with fish and roasted ground rice.",
    price: 3.50,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    ingredients: [{ name: "Vegetables", quantity: 0.3, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "ឆាត្រកួន",
    description: "Fresh water spinach stir-fried with garlic and fermented soy beans.",
    price: 2.00,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Water Spinach", quantity: 0.3, unit: "kg" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "សម្លម្ជូរយួន",
    description: "Tamarind-based soup with fish, pineapple, tomatoes, and winter melon.",
    price: 4.00,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1547592166-73ac45757d42?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fish", quantity: 0.2, unit: "kg" }, { name: "Pineapple", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  {
    name: "ម្ជូរគ្រឿង",
    description: "Yellow lemongrass sour soup with beef and morning glory.",
    price: 4.50,
    category: "Main Course",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.15, unit: "kg" }, { name: "Morning Glory", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },

  // Dinner - Evening
  {
    name: "បង្កងអាំង",
    description: "Fresh river prawns grilled with garlic butter and served with seafood sauce.",
    price: 12.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    ingredients: [{ name: "Prawns", quantity: 0.3, unit: "kg" }, { name: "Garlic Butter", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "ប្រហុកខ្ទិះ",
    description: "Creamy dip made with fermented fish, minced pork, and coconut milk, served with vegetables.",
    price: 3.50,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&h=300&fit=crop",
    ingredients: [{ name: "Pork", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "ត្រីបំពង",
    description: "Crispy fried whole fish topped with a sweet and spicy chili mango sauce.",
    price: 8.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fish", quantity: 0.5, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "សាច់គោអាំង",
    description: "Grilled beef lemongrass skewers marinated in local spices.",
    price: 3.50,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "មាន់ចំហុយ",
    description: "Steamed whole chicken with ginger and spring onions in a light soy broth.",
    price: 7.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
    ingredients: [{ name: "Chicken", quantity: 1.2, unit: "kg" }],
    isAvailable: true
  },

  // Snacks - Night
  {
    name: "លតឆា",
    description: "Short rice noodles stir-fried with beef, egg, and bean sprouts.",
    price: 2.00,
    category: "Snack",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Beef", quantity: 0.1, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "ខ្យងឆាគ្រឿង",
    description: "Steamed river snails tossed in a spicy garlic, lemongrass, and chili sauce.",
    price: 3.00,
    category: "Snack",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400&h=300&fit=crop",
    ingredients: [{ name: "Snails", quantity: 0.3, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "ឆាយ៉បំពង",
    description: "Crispy fried spring rolls filled with taro and minced pork.",
    price: 2.00,
    category: "Snack",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    ingredients: [{ name: "Spring Roll Wrappers", quantity: 5, unit: "pcs" }, { name: "Taro", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  {
    name: "កង្កែបបំពង",
    description: "Deep fried frog legs seasoned with salt, garlic, and pepper.",
    price: 4.50,
    category: "Snack",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1579213838058-c00f94605073?w=400&h=300&fit=crop",
    ingredients: [{ name: "Frog Legs", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "ប្រហិតបំពង",
    description: "Mixed deep fried meatballs (beef, pork, and fish) with sweet chili sauce.",
    price: 2.00,
    category: "Snack",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?w=400&h=300&fit=crop",
    ingredients: [{ name: "Meatballs", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },

  // Desserts - Night
  {
    name: "សង់ខ្យាល្ពៅ",
    description: "Delicious pumpkin custard made with coconut milk and eggs.",
    price: 2.50,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    ingredients: [{ name: "Pumpkin", quantity: 0.2, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "បាយដំណើបស្វាយ",
    description: "Sweet sticky rice served with fresh yellow mango and coconut cream.",
    price: 3.00,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=300&fit=crop",
    ingredients: [{ name: "Sticky Rice", quantity: 0.15, unit: "kg" }, { name: "Mango", quantity: 1, unit: "pcs" }],
    isAvailable: true
  },
  {
    name: "នំលត",
    description: "Green rice starch jelly in sweet coconut milk and palm sugar syrup.",
    price: 1.50,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Starch", quantity: 50, unit: "g" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "ចេកខ្ទិះ",
    description: "Sweet bananas cooked in savory-sweet coconut milk with tapioca pearls.",
    price: 1.50,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    ingredients: [{ name: "Banana", quantity: 2, unit: "pcs" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "ទឹកកកឈូស",
    description: "Shaved ice with mixed fruits, syrups, and condensed milk.",
    price: 2.00,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400&h=300&fit=crop",
    ingredients: [{ name: "Shaved Ice", quantity: 1, unit: "pcs" }, { name: "Fruits", quantity: 50, unit: "g" }],
    isAvailable: true
  }
];
