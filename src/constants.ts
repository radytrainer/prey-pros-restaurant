import { MenuItem } from './types';

export const SAMPLE_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  // Morning
  {
    name: "Bai Sach Chrouk (Pork and Rice) / បាយសាច់ជ្រូក",
    description: "Grilled pork marinated in coconut milk and garlic, served with rice and pickled vegetables.",
    price: 3.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=400&h=300&fit=crop",
    ingredients: [{ name: "Pork", quantity: 0.2, unit: "kg" }, { name: "Rice", quantity: 0.3, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Kuy Teav (Noodle Soup) / គុយទាវ",
    description: "Traditional rice noodle soup with pork bone broth, minced pork, and fresh herbs.",
    price: 3.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1569870499705-504209102861?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Pork", quantity: 0.1, unit: "kg" }, { name: "Herbs", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Nom Banh Chok (Khmer Noodles) / នំបញ្ចុក",
    description: "Rice noodles topped with a green fish gravy and fresh seasonal vegetables.",
    price: 2.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }, { name: "Vegetables", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Borbor (Rice Porridge) / បបរ",
    description: "Savory rice porridge with chicken, ginger, and crispy fried garlic.",
    price: 2.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice", quantity: 0.1, unit: "kg" }, { name: "Chicken", quantity: 0.1, unit: "kg" }, { name: "Ginger", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Num Pang (Cambodian Sandwich) / នំបុ័ង",
    description: "Baguette filled with pâté, pickled papaya, and grilled meat.",
    price: 2.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop",
    ingredients: [{ name: "Baguette", quantity: 1, unit: "pcs" }, { name: "Pâté", quantity: 30, unit: "g" }, { name: "Meat", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  // Afternoon
  {
    name: "Fish Amok / អាម៉ុកត្រី",
    description: "Steamed fish curry with coconut milk and kroeung, served in a banana leaf.",
    price: 6.50,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fish", quantity: 0.2, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }, { name: "Kroeung", quantity: 30, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Beef Lok Lak / ឡុកឡាក់សាច់គោ",
    description: "Stir-fried beef in a savory sauce, served with lime-pepper dipping sauce and rice.",
    price: 7.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.2, unit: "kg" }, { name: "Lime", quantity: 1, unit: "pcs" }, { name: "Pepper", quantity: 5, unit: "g" }, { name: "Rice", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Samlor Korko / សម្លកកូរ",
    description: "Traditional Khmer vegetable stew with fish and roasted ground rice.",
    price: 5.50,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    ingredients: [{ name: "Vegetables", quantity: 0.3, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }, { name: "Rice", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Stir-fried Morning Glory / ឆាត្រកួន",
    description: "Fresh water spinach stir-fried with garlic and oyster sauce.",
    price: 4.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Water Spinach", quantity: 0.3, unit: "kg" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Chicken Curry / ការីមាន់",
    description: "Red curry with chicken, sweet potatoes, and onions, served with bread or rice.",
    price: 6.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
    ingredients: [{ name: "Chicken", quantity: 0.2, unit: "kg" }, { name: "Sweet Potato", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  // Evening
  {
    name: "Grilled Prawns / បង្កងអាំង",
    description: "Fresh river prawns grilled with garlic butter and served with seafood sauce.",
    price: 12.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    ingredients: [{ name: "Prawns", quantity: 0.3, unit: "kg" }, { name: "Garlic Butter", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Prahok Ktis / ប្រហុកខ្ទិះ",
    description: "Creamy dip made with fermented fish, minced pork, and coconut milk, served with fresh vegetables.",
    price: 5.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fermented Fish", quantity: 50, unit: "g" }, { name: "Pork", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "Samlor Machu Kroeung / សម្លម្ជូរគ្រឿង",
    description: "Sour soup with beef, water spinach, and yellow kroeung paste.",
    price: 6.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.1, unit: "kg" }, { name: "Water Spinach", quantity: 0.2, unit: "kg" }, { name: "Kroeung", quantity: 30, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Fried Whole Fish / ត្រីបំពង",
    description: "Crispy fried fish topped with a sweet and spicy chili sauce.",
    price: 10.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop",
    ingredients: [{ name: "Fish", quantity: 0.5, unit: "kg" }, { name: "Chili Sauce", quantity: 30, unit: "ml" }],
    isAvailable: true
  },
  {
    name: "Beef Skewers / សាច់គោអាំង",
    description: "Grilled beef skewers marinated in lemongrass and turmeric.",
    price: 4.50,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Beef", quantity: 0.2, unit: "kg" }, { name: "Lemongrass", quantity: 20, unit: "g" }, { name: "Turmeric", quantity: 5, unit: "g" }],
    isAvailable: true
  },
  // Night
  {
    name: "Fried Noodles (Lort Cha) / លតឆា",
    description: "Short rice noodles stir-fried with beef, egg, and bean sprouts.",
    price: 3.00,
    category: "Snacks",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Beef", quantity: 0.1, unit: "kg" }, { name: "Egg", quantity: 1, unit: "pcs" }],
    isAvailable: true
  },
  {
    name: "Snails with Chili / ខ្យងឆាគ្រឿង",
    description: "Steamed river snails tossed in a spicy garlic and chili sauce.",
    price: 4.00,
    category: "Snacks",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400&h=300&fit=crop",
    ingredients: [{ name: "Snails", quantity: 0.3, unit: "kg" }, { name: "Chili", quantity: 10, unit: "g" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Crispy Chicken Wings / ស្លាបមាន់បំពង",
    description: "Deep-fried wings marinated in Khmer spices.",
    price: 5.00,
    category: "Snacks",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    ingredients: [{ name: "Chicken Wings", quantity: 0.3, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Fruit Platter / ផ្លែឈើស្រស់",
    description: "Seasonal Cambodian fruits like mango, dragon fruit, and longan.",
    price: 3.50,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&h=300&fit=crop",
    ingredients: [{ name: "Mixed Fruits", quantity: 0.5, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Mung Bean Soup / បង្អែមសណ្តែកខៀវ",
    description: "Sweet dessert soup with mung beans and coconut milk.",
    price: 2.00,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    ingredients: [{ name: "Mung Beans", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  }
];
