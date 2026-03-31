import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { getSales, subscribeToOrders, createOrder, getMenuItems } from '../services/firebaseService';
import { seedAdminData } from '../services/seedAdminData';
import type { Order, Sale, MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const data = [
  { name: 'Mon', sales: 4000, orders: 240 },
  { name: 'Tue', sales: 3000, orders: 198 },
  { name: 'Wed', sales: 2000, orders: 150 },
  { name: 'Thu', sales: 2780, orders: 210 },
  { name: 'Fri', sales: 1890, orders: 180 },
  { name: 'Sat', sales: 2390, orders: 250 },
  { name: 'Sun', sales: 3490, orders: 310 },
];

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{menuItemId: string, quantity: number, price: number, name: string}[]>([]);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToOrders(setOrders);
    getSales().then(setSales);
    getMenuItems().then(setMenuItems);
    return () => unsubscribe();
  }, []);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    const totalPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    try {
      await createOrder({
        tableNumber,
        items: selectedItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, price: i.price, name: i.name })),
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: 'staff-1' // Mock staff ID
      });
      setIsOrderModalOpen(false);
      setSelectedItems([]);
      setTableNumber('');
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const addItemToOrder = (item: MenuItem) => {
    const existing = selectedItems.find(i => i.menuItemId === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { menuItemId: item.id, quantity: 1, price: item.price, name: item.name }]);
    }
  };

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { label: 'Total Revenue / ចំណូលសរុប', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Orders / ការកម្ម៉ង់កំពុងដំណើរការ', value: activeOrders.toString(), icon: ShoppingBag, trend: '+5.2%', color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed Orders / ការកម្ម៉ង់បានបញ្ចប់', value: completedOrders.toString(), icon: CheckCircle2, trend: '+8.1%', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Customers / អតិថិជនសរុប', value: '1,240', icon: Users, trend: '+2.4%', color: 'bg-stone-50 text-stone-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Dashboard Overview / ផ្ទាំងគ្រប់គ្រង</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
            Download Report / ទាញយករបាយការណ៍
          </button>
          <button 
            onClick={() => setIsOrderModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors shadow-md shadow-amber-200"
          >
            Add New Order / បន្ថែមការកម្ម៉ង់
          </button>
          <button 
            onClick={seedAdminData}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-md shadow-red-200"
          >
            Seed Admin Data (Testing)
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-stone-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-stone-900">Add New Order / បន្ថែមការកម្ម៉ង់</h2>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-stone-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Menu Items / មុខម្ហូប</h3>
                  <div className="space-y-2">
                    {menuItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => addItemToOrder(item)}
                        className="p-3 bg-stone-50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-stone-900 group-hover:text-amber-600">{item.name}</p>
                          <p className="text-xs text-stone-500">${item.price}</p>
                        </div>
                        <Plus className="w-4 h-4 text-stone-300 group-hover:text-amber-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Order Summary / សេចក្តីសង្ខេប</h3>
                  <div className="flex-1 space-y-3">
                    {selectedItems.map(item => (
                      <div key={item.menuItemId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-xs">
                            {item.quantity}
                          </span>
                          <span className="font-medium text-stone-700">{item.name}</span>
                        </div>
                        <span className="font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {selectedItems.length === 0 && (
                      <p className="text-sm text-stone-400 italic">No items selected.</p>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-stone-50 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Table Number / លេខតុ</label>
                      <input 
                        required
                        type="text" 
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Total / សរុប</span>
                      <span className="text-2xl font-bold text-stone-900">
                        ${selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={handleAddOrder}
                      disabled={selectedItems.length === 0 || !tableNumber}
                      className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
                    >
                      Place Order / បញ្ជាទិញ
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
                {stat.trend}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-stone-900">Revenue Performance / សកម្មភាពចំណូល</h2>
            <select className="bg-stone-50 border-none rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{color: '#d97706', fontWeight: 600}}
                />
                <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Recent Orders / ការកម្ម៉ង់ថ្មីៗ</h2>
          <div className="space-y-6">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-4 group cursor-pointer">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                  order.status === 'preparing' ? 'bg-amber-50 text-amber-600' :
                  order.status === 'ready' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-stone-50 text-stone-500'
                )}>
                  {order.status === 'pending' ? <Clock className="w-6 h-6" /> :
                   order.status === 'preparing' ? <ChefHat className="w-6 h-6" /> :
                   <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-600 transition-colors">
                    Table {order.tableNumber}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {order.items.length} items • ${order.totalPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-10">
                <AlertCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-400 text-sm">No recent orders found.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3 bg-stone-50 text-stone-600 font-semibold rounded-2xl hover:bg-stone-100 transition-colors">
            View All Orders / មើលការកម្ម៉ង់ទាំងអស់
          </button>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
