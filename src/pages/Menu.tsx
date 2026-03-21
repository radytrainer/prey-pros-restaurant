import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  ChevronRight,
  PlusCircle,
  MinusCircle,
  Trash2,
  X
} from 'lucide-react';
import { getMenuItems, createOrder } from '../services/firebaseService';
import { useAuth } from '../components/AuthContext';
import type { MenuItem, OrderItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    getMenuItems().then(setItems);
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category))];

  const filteredItems = items.filter(item => 
    (category === 'All' || item.category === category) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || 
     item.description.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.menuItemId === menuItemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await createOrder({
        userId: profile?.uid || 'anonymous',
        items: cart,
        totalPrice: total,
        status: 'pending',
        tableNumber: '1', // Default for now
        createdAt: new Date().toISOString()
      });
      setCart([]);
      setIsCartOpen(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Menu Management / ការគ្រប់គ្រងមុខម្ហូប</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Discover and manage our delicious offerings.</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="Search menu... / ស្វែងរកមុខម្ហូប..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 sm:p-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 h-6 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
              category === cat 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-100' 
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={item.imageUrl || `https://picsum.photos/seed/${item.name}/400/300`} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-amber-600 shadow-sm">
                ${item.price}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-wider">{item.category}</span>
              </div>
              <p className="text-sm text-stone-500 line-clamp-2 mb-6 leading-relaxed">{item.description}</p>
              <button
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                  item.isAvailable 
                    ? 'bg-stone-900 text-white hover:bg-amber-600 shadow-lg shadow-stone-200' 
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                {item.isAvailable ? 'Add to Cart / បញ្ជាទិញ' : 'Out of Stock / អស់ពីស្តុក'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Your Cart / កន្ត្រកទំនិញ</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-sm text-amber-600 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50 p-1 rounded-xl border border-stone-100">
                      <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-1 hover:text-amber-600 transition-colors">
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      <span className="w-6 text-center font-bold text-stone-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-1 hover:text-amber-600 transition-colors">
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.menuItemId)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center py-20">
                    <ShoppingCart className="w-16 h-16 text-stone-100 mx-auto mb-6" />
                    <p className="text-stone-400 font-medium">Your cart is empty. / កន្ត្រកទំនិញទទេ</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-amber-600 font-bold hover:underline"
                    >
                      Start browsing / ចាប់ផ្តើមមើលមុខម្ហូប
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 bg-stone-50 border-t border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-stone-500 font-medium">Total Amount / សរុប</span>
                  <span className="text-3xl font-bold text-stone-900">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 disabled:bg-stone-300 disabled:shadow-none"
                >
                  Place Order / បញ្ជាទិញ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
