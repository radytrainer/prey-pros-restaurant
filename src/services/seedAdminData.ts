import { createMenuItem, createOrder, createTable } from './firebaseService';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedAdminData = async () => {
  try {
    console.log('Seeding admin data started...');

    // 1. Seed Menu Items
    const menuItems = [
      { name: 'មីស៊ុប', description: 'មីស៊ុបដ៏ឈ្ងុយឆ្ងាញ់', price: 3.50, category: 'Main', ingredients: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80' },
      { name: 'បបរ', description: 'បបរក្តៅៗ', price: 2.50, category: 'Main', ingredients: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80' },
      { name: 'នំបុ័ងស៊ុត', description: 'នំបុ័ងស៊ុតជាមួយជី', price: 2.00, category: 'Breakfast', ingredients: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80' },
      { name: 'បាយឆា', description: 'បាយឆាពេលព្រឹក', price: 3.00, category: 'Main', ingredients: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80' },
      { name: 'នំប៉ាវ', description: 'នំប៉ាវទន់ៗ', price: 1.50, category: 'Snack', ingredients: [], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1560159902-17855b410c57?w=600&q=80' },
    ];

    const menuIds: string[] = [];
    for (const item of menuItems) {
      const id = await createMenuItem(item as any);
      menuIds.push(id);
    }
    console.log('Menu seeded.');

    // 2. Seed Tables
    const tables = [
      { number: '1', status: 'occupied', capacity: 4 },
      { number: '2', status: 'available', capacity: 2 },
      { number: '3', status: 'available', capacity: 6 },
      { number: '4', status: 'reserved', capacity: 4 },
      { number: '5', status: 'available', capacity: 2 },
    ];

    for (const table of tables) {
      await createTable(table as any);
    }
    console.log('Tables seeded.');

    // 4. Seed Orders and Sales
    // Create some past sales for the chart
    for (let i = 0; i < 20; i++) {
        const orderPrice = Math.floor(Math.random() * 20) + 5;
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // past 7 days
        
        // Push sale
        await addDoc(collection(db, 'sales'), {
            orderId: `mock-${i}`,
            amount: orderPrice,
            createdAt: date.toISOString()
        });
    }

    // Create some active orders
    const statuses: any[] = ['pending', 'preparing', 'ready', 'completed'];
    for (let i = 0; i < 5; i++) {
        const itemObj = menuItems[Math.floor(Math.random() * menuItems.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        await createOrder({
            userId: 'admin',
            items: [{
                menuItemId: menuIds[Math.floor(Math.random() * menuIds.length)] || 'mock',
                name: itemObj.name,
                quantity: qty,
                price: itemObj.price,
                imageUrl: itemObj.imageUrl
            }],
            totalPrice: itemObj.price * qty,
            status: statuses[i % statuses.length],
            tableNumber: String(i + 1),
            createdAt: new Date().toISOString()
        });
    }
    console.log('Orders and Sales seeded.');

    alert('Admin data seeded successfully! Please refresh or let it auto-update.');
  } catch (error) {
    console.error('Seeding failed', error);
    alert('Failed to seed admin data.');
  }
};
