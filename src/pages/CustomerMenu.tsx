import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  PlusCircle,
  MinusCircle,
  Trash2,
  X,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Wallet,
  Timer,
  ChevronRight,
  Utensils,
  QrCode,
  History
} from 'lucide-react';
import { getMenuItems, createOrder, subscribeToOrders } from '../services/firebaseService';
import { useAuth } from '../components/AuthContext';
import type { MenuItem, OrderItem, Order, PaymentMethod, TimeCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerMenu: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [timeCategory, setTimeCategory] = useState<TimeCategory | 'All'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ items: OrderItem[], total: number } | null>(null);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const { profile, user } = useAuth();

  useEffect(() => {
    // Subscribe to all active orders to calculate kitchen load
    const unsubscribe = subscribeToOrders((orders) => {
      const active = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
      setActiveOrdersCount(active.length);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getMenuItems().then(setItems);
    
    // Auto-detect time category based on current hour
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeCategory('Morning');
    else if (hour >= 11 && hour < 16) setTimeCategory('Afternoon');
    else if (hour >= 16 && hour < 21) setTimeCategory('Evening');
    else setTimeCategory('Night');
  }, []);

  useEffect(() => {
    const userId = profile?.uid || user?.uid;
    const filters = userId ? { userId } : { tableNumber: tableId };
    
    const unsubscribe = subscribeToOrders((orders) => {
      setMyOrders(orders);
    }, filters);
    return () => unsubscribe();
  }, [profile, user, tableId]);

  const categories = ['All', ...new Set(items.map(i => i.category))];
  const timeCategories: (TimeCategory | 'All')[] = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];

  const filteredItems = items.filter(item => 
    (category === 'All' || item.category === category) &&
    (timeCategory === 'All' || item.timeCategory === timeCategory) &&
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

  const calculateWaitTime = () => {
    // Base wait time is 15 minutes
    // Add 3 minutes for each active order in the kitchen
    // If kitchen is very busy (> 10 orders), add extra buffer
    const baseTime = 15;
    const perOrderTime = 3;
    const kitchenLoadBuffer = activeOrdersCount > 10 ? 10 : 0;
    
    const minTime = baseTime + (activeOrdersCount * perOrderTime) + kitchenLoadBuffer;
    const maxTime = minTime + 10;
    
    return `${minTime}-${maxTime} min`;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const orderData = {
      userId: profile?.uid || user?.uid || 'anonymous',
      items: [...cart],
      totalPrice: total,
      status: 'pending' as const,
      tableNumber: tableId || '1',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    try {
      await createOrder(orderData);
      setLastOrder({ items: [...cart], total });
      setCart([]);
      setIsCartOpen(false);
      setShowPaymentSelection(false);
      setShowConfirmation(true);
      setOrderPlaced(true);
      setTimeout(() => setOrderPlaced(false), 5000);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-amber-200">
            {tableId || '?'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900">Table {tableId}</h1>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Prey Pros Restaurant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
            <div className={`w-2 h-2 rounded-full ${activeOrdersCount > 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              Kitchen: {activeOrdersCount > 5 ? 'Busy' : 'Normal'}
            </span>
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'menu' ? 'orders' : 'menu')}
            className="p-3 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 transition-all relative"
          >
            {activeTab === 'menu' ? <Timer className="w-6 h-6" /> : <Utensils className="w-6 h-6" />}
            {activeTab === 'menu' && myOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
            )}
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-stone-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-stone-200"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 p-6 space-y-8 max-w-2xl mx-auto w-full ${cart.length > 0 && activeTab === 'menu' ? 'pb-32' : 'pb-10'}`}>
        {activeTab === 'menu' ? (
          <>
            {orderPlaced && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700"
              >
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-bold">Order placed! / បញ្ជាទិញបានជោគជ័យ!</p>
                  <p className="text-xs">We're preparing your meal. / យើងកំពុងរៀបចំអាហាររបស់អ្នក។</p>
                </div>
              </motion.div>
            )}

            {/* Time Categories */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Time Category / ប្រភេទតាមពេលវេលា
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {timeCategories.map((tc) => (
                  <button
                    key={tc}
                    onClick={() => setTimeCategory(tc)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      timeCategory === tc 
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-100' 
                        : 'bg-white text-stone-600 border-stone-100'
                    }`}
                  >
                    {tc}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Categories */}
            <div className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search dishes... / ស្វែងរកមុខម្ហូប..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm shadow-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      category === cat 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                        : 'bg-white text-stone-600 border-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm flex flex-col group"
                >
                  <div className="aspect-square relative flex-shrink-0">
                    <img 
                      src={item.imageUrl || `https://picsum.photos/seed/${item.name}/400/400`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 shadow-sm">
                      ${item.price}
                    </div>
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/60 px-2 py-1 rounded">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-stone-900 truncate text-sm">{item.name}</h3>
                      </div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">{item.category}</p>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          item.isAvailable 
                            ? 'bg-amber-600 text-white active:scale-95 shadow-lg shadow-amber-100' 
                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Order Tracking View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">Track Orders / តាមដានការបញ្ជាទិញ</h2>
              <button 
                onClick={() => setActiveTab('menu')}
                className="text-amber-600 text-sm font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Menu
              </button>
            </div>

            {myOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[32px] border border-stone-100">
                <Timer className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                <p className="text-stone-400 font-medium">No active orders found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Order #{order.id.slice(-6)}</p>
                        <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>

                    {/* Order Progress Bar */}
                    <div className="space-y-4 py-2">
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ 
                              width: order.status === 'pending' ? '15%' : 
                                     order.status === 'preparing' ? '50%' : 
                                     order.status === 'ready' || order.status === 'completed' ? '100%' : '0%'
                            }}
                            className={`h-full transition-all duration-700 ${
                              order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            }`}
                          />
                        </div>

                        {/* Status Points */}
                        <div className="relative flex justify-between">
                          {[
                            { id: 'pending', label: 'Pending', icon: Clock },
                            { id: 'preparing', label: 'Preparing', icon: Utensils },
                            { id: 'ready', label: 'Ready', icon: CheckCircle2 }
                          ].map((stage, idx) => {
                            const isPast = (order.status === 'pending' && idx === 0) || 
                                           (order.status === 'preparing' && idx <= 1) || 
                                           ((order.status === 'ready' || order.status === 'completed') && idx <= 2);
                            const isCurrent = order.status === stage.id;
                            const Icon = stage.icon;

                            return (
                              <div key={stage.id} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                  isPast ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white border-2 border-stone-100 text-stone-300'
                                } ${isCurrent ? 'scale-110 ring-4 ring-amber-100' : ''}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                                  isPast ? 'text-stone-900' : 'text-stone-300'
                                }`}>
                                  {stage.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest">Est. Wait Time</p>
                            <p className="text-sm font-bold text-amber-900">{calculateWaitTime()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest">Kitchen Load</p>
                          <p className="text-xs text-amber-900 font-medium">{activeOrdersCount} active orders</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-stone-600">{item.quantity}x {item.name}</span>
                          <span className="text-stone-900 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                      <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Total</span>
                      <span className="text-lg font-bold text-stone-900">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[32px] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Your Order / ការបញ្ជាទិញ</h2>
                  <p className="text-xs text-stone-500 font-medium">Table {tableId}</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-stone-50 rounded-xl">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {showPaymentSelection ? (
                  <div className="space-y-6">
                    <button 
                      onClick={() => setShowPaymentSelection(false)}
                      className="text-amber-600 text-sm font-bold flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Cart
                    </button>
                    <h3 className="text-lg font-bold text-stone-900">Select Payment Method / ជ្រើសរើសវិធីបង់ប្រាក់</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <button
                        onClick={() => setPaymentMethod('Cash')}
                        className={`p-6 rounded-[32px] border-2 transition-all flex items-center gap-4 ${
                          paymentMethod === 'Cash' ? 'border-amber-600 bg-amber-50' : 'border-stone-100 bg-white'
                        }`}
                      >
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-stone-900">Cash / សាច់ប្រាក់</p>
                          <p className="text-xs text-stone-500">Pay at the counter or table</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('KHQR')}
                        className={`p-6 rounded-[32px] border-2 transition-all flex items-center gap-4 ${
                          paymentMethod === 'KHQR' ? 'border-amber-600 bg-amber-50' : 'border-stone-100 bg-white'
                        }`}
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-stone-900">KHQR / ស្កេនបង់ប្រាក់</p>
                          <p className="text-xs text-stone-500">Scan to pay with any bank app</p>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'KHQR' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[32px] border border-stone-100 flex flex-col items-center gap-8 shadow-sm"
                      >
                        <div className="text-center space-y-2">
                          <h4 className="font-bold text-stone-900 text-lg">Scan to Pay / ស្កេនដើម្បីបង់ប្រាក់</h4>
                          <div className="flex flex-col gap-1">
                            <p className="text-xs text-stone-500">1. Open your bank app / បើកកម្មវិធីធនាគាររបស់អ្នក</p>
                            <p className="text-xs text-stone-500">2. Scan the QR code below / ស្កេនកូដ QR ខាងក្រោម</p>
                            <p className="text-xs text-stone-500">3. Enter amount: <span className="font-bold text-amber-600">${total.toFixed(2)}</span></p>
                          </div>
                        </div>

                        <div className="relative p-6 bg-white border-4 border-amber-600 rounded-[40px] shadow-2xl shadow-amber-100/50">
                          <div className="w-56 h-56 bg-stone-50 rounded-[32px] flex flex-col items-center justify-center border border-stone-100 overflow-hidden relative group">
                            {/* Placeholder for real KHQR image */}
                            <div className="flex flex-col items-center gap-3">
                              <div className="relative">
                                <QrCode className="w-28 h-28 text-stone-900" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-8 h-8 bg-white rounded-lg border-2 border-stone-900 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-red-600 rounded-sm" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">KHQR</p>
                                <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1">Scan with any bank app</p>
                              </div>
                            </div>
                            
                            {/* Decorative corners */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-200 rounded-tl-lg" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-200 rounded-tr-lg" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-stone-200 rounded-bl-lg" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-stone-200 rounded-br-lg" />
                          </div>
                          
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                            Official KHQR
                          </div>
                        </div>

                        <div className="w-full space-y-4">
                          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex items-start gap-3">
                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-emerald-900">Payment Confirmation / ការបញ្ជាក់ការបង់ប្រាក់</p>
                              <p className="text-[10px] text-emerald-700 leading-relaxed">
                                Once you've completed the transfer, please click the "Complete Order" button below. Our staff will verify the transaction.
                                <br />
                                នៅពេលអ្នកបានបញ្ចប់ការផ្ទេរប្រាក់ សូមចុចប៊ូតុង "បញ្ចប់ការបញ្ជាទិញ" ខាងក្រោម។ បុគ្គលិករបស់យើងនឹងផ្ទៀងផ្ទាត់ប្រតិបត្តិការ។
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Prey Pros Restaurant</p>
                            <p className="text-sm font-bold text-stone-900 mt-1">Total: ${total.toFixed(2)}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.menuItemId} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100 overflow-hidden flex-shrink-0">
                          <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-stone-900 truncate text-sm">{item.name}</h4>
                          <p className="text-xs text-amber-600 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-stone-50 p-1 rounded-xl border border-stone-100">
                          <button onClick={() => updateQuantity(item.menuItemId, -1)} className="p-1">
                            <MinusCircle className="w-5 h-5 text-stone-400" />
                          </button>
                          <span className="w-4 text-center font-bold text-stone-900 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.menuItemId, 1)} className="p-1">
                            <PlusCircle className="w-5 h-5 text-amber-600" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.menuItemId)} className="p-2 text-stone-300">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-12 h-12 text-stone-100 mx-auto mb-4" />
                        <p className="text-stone-400 text-sm font-medium">Your cart is empty.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-6 bg-stone-50 border-t border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-stone-500 font-bold text-sm">Total / សរុប</span>
                  <span className="text-2xl font-bold text-stone-900">${total.toFixed(2)}</span>
                </div>
                {showPaymentSelection ? (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-amber-600 text-white font-bold py-4 rounded-2xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-100 active:scale-95"
                  >
                    Complete Order / បញ្ចប់ការបញ្ជាទិញ
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPaymentSelection(true)}
                    disabled={cart.length === 0}
                    className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-100 disabled:bg-stone-300 disabled:shadow-none active:scale-95"
                  >
                    Proceed to Payment / បន្តទៅការបង់ប្រាក់
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmation && lastOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-[40px] shadow-2xl z-[70] flex flex-col overflow-hidden"
            >
              <div className="p-8 text-center bg-amber-600 text-white relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                <p className="text-amber-100 text-sm mt-1">ការបញ្ជាទិញត្រូវបានបញ្ជាក់!</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="flex items-center justify-around py-4 border-b border-stone-100">
                  <div className="text-center">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Wait Time</p>
                    <div className="flex items-center gap-1.5 justify-center text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{calculateWaitTime()}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-stone-100" />
                  <div className="text-center">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Table</p>
                    <div className="flex items-center gap-1.5 justify-center text-stone-900">
                      <Utensils className="w-4 h-4" />
                      <span className="font-bold">{tableId}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Order Summary</h3>
                  <div className="space-y-3">
                    {lastOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-stone-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-stone-600 border border-stone-100">
                            {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-stone-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-stone-500 font-bold">Total Paid</span>
                  <span className="text-2xl font-bold text-amber-600">${lastOrder.total.toFixed(2)}</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-[10px] text-stone-500 leading-relaxed text-center">
                    Your order has been sent to the kitchen. You can track its progress in the "Orders" tab.
                    <br />
                    ការបញ្ជាទិញរបស់អ្នកត្រូវបានផ្ញើទៅផ្ទះបាយ។ អ្នកអាចតាមដានវានៅក្នុងផ្ទាំង "ការបញ្ជាទិញ"។
                  </p>
                </div>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setActiveTab('orders');
                  }}
                  className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-100 active:scale-95"
                >
                  Track My Order / តាមដានការបញ្ជាទិញ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Cart Summary */}
      {cart.length > 0 && !isCartOpen && activeTab === 'menu' && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-100 p-4 pb-8 sm:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-stone-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-stone-200 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm">View Cart / មើលកញ្ចប់ទំនិញ</span>
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest font-bold">Items ready to order</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg">${total.toFixed(2)}</span>
                <span className="block text-[10px] text-amber-500 font-bold uppercase tracking-widest">Checkout</span>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
