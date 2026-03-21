import { MenuItem } from './types';

export const SAMPLE_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  // Morning
  {
    name: "Bai Sach Chrouk (Pork and Rice) / បាយសាច់ជ្រូក",
    description: "Grilled pork marinated in coconut milk and garlic, served with rice and pickled vegetables.",
    price: 3.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://picsum.photos/seed/porkrice/400/300",
    ingredients: [{ name: "Pork", quantity: 0.2, unit: "kg" }, { name: "Rice", quantity: 0.3, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Kuy Teav (Noodle Soup) / គុយទាវ",
    description: "Traditional rice noodle soup with pork bone broth, minced pork, and fresh herbs.",
    price: 3.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://picsum.photos/seed/noodlesoup/400/300",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Pork", quantity: 0.1, unit: "kg" }, { name: "Herbs", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Nom Banh Chok (Khmer Noodles) / នំបញ្ចុក",
    description: "Rice noodles topped with a green fish gravy and fresh seasonal vegetables.",
    price: 2.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://picsum.photos/seed/khmernoodles/400/300",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }, { name: "Vegetables", quantity: 50, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Borbor (Rice Porridge) / បបរ",
    description: "Savory rice porridge with chicken, ginger, and crispy fried garlic.",
    price: 2.00,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://picsum.photos/seed/porridge/400/300",
    ingredients: [{ name: "Rice", quantity: 0.1, unit: "kg" }, { name: "Chicken", quantity: 0.1, unit: "kg" }, { name: "Ginger", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Num Pang (Cambodian Sandwich) / នំបុ័ង",
    description: "Baguette filled with pâté, pickled papaya, and grilled meat.",
    price: 2.50,
    category: "Breakfast",
    timeCategory: "Morning",
    imageUrl: "https://picsum.photos/seed/sandwich/400/300",
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
    imageUrl: "https://picsum.photos/seed/fishamok/400/300",
    ingredients: [{ name: "Fish", quantity: 0.2, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }, { name: "Kroeung", quantity: 30, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Beef Lok Lak / ឡុកឡាក់សាច់គោ",
    description: "Stir-fried beef in a savory sauce, served with lime-pepper dipping sauce and rice.",
    price: 7.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://picsum.photos/seed/beefloklak/400/300",
    ingredients: [{ name: "Beef", quantity: 0.2, unit: "kg" }, { name: "Lime", quantity: 1, unit: "pcs" }, { name: "Pepper", quantity: 5, unit: "g" }, { name: "Rice", quantity: 0.2, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Samlor Korko / សម្លកកូរ",
    description: "Traditional Khmer vegetable stew with fish and roasted ground rice.",
    price: 5.50,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://picsum.photos/seed/stew/400/300",
    ingredients: [{ name: "Vegetables", quantity: 0.3, unit: "kg" }, { name: "Fish", quantity: 0.1, unit: "kg" }, { name: "Rice", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Stir-fried Morning Glory / ឆាត្រកួន",
    description: "Fresh water spinach stir-fried with garlic and oyster sauce.",
    price: 4.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://picsum.photos/seed/morningglory/400/300",
    ingredients: [{ name: "Water Spinach", quantity: 0.3, unit: "kg" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Chicken Curry / ការីមាន់",
    description: "Red curry with chicken, sweet potatoes, and onions, served with bread or rice.",
    price: 6.00,
    category: "Lunch",
    timeCategory: "Afternoon",
    imageUrl: "https://picsum.photos/seed/chickencurry/400/300",
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
    imageUrl: "https://picsum.photos/seed/prawns/400/300",
    ingredients: [{ name: "Prawns", quantity: 0.3, unit: "kg" }, { name: "Garlic Butter", quantity: 20, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Prahok Ktis / ប្រហុកខ្ទិះ",
    description: "Creamy dip made with fermented fish, minced pork, and coconut milk, served with fresh vegetables.",
    price: 5.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://picsum.photos/seed/prahok/400/300",
    ingredients: [{ name: "Fermented Fish", quantity: 50, unit: "g" }, { name: "Pork", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  },
  {
    name: "Samlor Machu Kroeung / សម្លម្ជូរគ្រឿង",
    description: "Sour soup with beef, water spinach, and yellow kroeung paste.",
    price: 6.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://picsum.photos/seed/soursoup/400/300",
    ingredients: [{ name: "Beef", quantity: 0.1, unit: "kg" }, { name: "Water Spinach", quantity: 0.2, unit: "kg" }, { name: "Kroeung", quantity: 30, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Fried Whole Fish / ត្រីបំពង",
    description: "Crispy fried fish topped with a sweet and spicy chili sauce.",
    price: 10.00,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://picsum.photos/seed/friedfish/400/300",
    ingredients: [{ name: "Fish", quantity: 0.5, unit: "kg" }, { name: "Chili Sauce", quantity: 30, unit: "ml" }],
    isAvailable: true
  },
  {
    name: "Beef Skewers / សាច់គោអាំង",
    description: "Grilled beef skewers marinated in lemongrass and turmeric.",
    price: 4.50,
    category: "Dinner",
    timeCategory: "Evening",
    imageUrl: "https://picsum.photos/seed/beefskewers/400/300",
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
    imageUrl: "https://picsum.photos/seed/friednoodles/400/300",
    ingredients: [{ name: "Rice Noodles", quantity: 0.2, unit: "kg" }, { name: "Beef", quantity: 0.1, unit: "kg" }, { name: "Egg", quantity: 1, unit: "pcs" }],
    isAvailable: true
  },
  {
    name: "Snails with Chili / ខ្យងឆាគ្រឿង",
    description: "Steamed river snails tossed in a spicy garlic and chili sauce.",
    price: 4.00,
    category: "Snacks",
    timeCategory: "Night",
    imageUrl: "https://picsum.photos/seed/snails/400/300",
    ingredients: [{ name: "Snails", quantity: 0.3, unit: "kg" }, { name: "Chili", quantity: 10, unit: "g" }, { name: "Garlic", quantity: 10, unit: "g" }],
    isAvailable: true
  },
  {
    name: "Crispy Chicken Wings / ស្លាបមាន់បំពង",
    description: "Deep-fried wings marinated in Khmer spices.",
    price: 5.00,
    category: "Snacks",
    timeCategory: "Night",
    imageUrl: "https://picsum.photos/seed/wings/400/300",
    ingredients: [{ name: "Chicken Wings", quantity: 0.3, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Fruit Platter / ផ្លែឈើស្រស់",
    description: "Seasonal Cambodian fruits like mango, dragon fruit, and longan.",
    price: 3.50,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://picsum.photos/seed/fruits/400/300",
    ingredients: [{ name: "Mixed Fruits", quantity: 0.5, unit: "kg" }],
    isAvailable: true
  },
  {
    name: "Mung Bean Soup / បង្អែមសណ្តែកខៀវ",
    description: "Sweet dessert soup with mung beans and coconut milk.",
    price: 2.00,
    category: "Dessert",
    timeCategory: "Night",
    imageUrl: "https://picsum.photos/seed/mungbean/400/300",
    ingredients: [{ name: "Mung Beans", quantity: 0.1, unit: "kg" }, { name: "Coconut Milk", quantity: 0.1, unit: "l" }],
    isAvailable: true
  }
];
