import React, { useEffect, useState } from 'react';
import { 
  QrCode, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { getTables, createTable, deleteTable, subscribeToTables, subscribeToOrders } from '../services/firebaseService';
import type { Table, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { TELEGRAM_BOT_USERNAME } from '../constants';


export const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const unsubTables = subscribeToTables(setTables);
    const unsubOrders = subscribeToOrders((orders) => {
      // Only keep orders that are not completed or cancelled
      const busy = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
      setActiveOrders(busy);
    });

    return () => {
      unsubTables();
      unsubOrders();
    };
  }, []);

  const handleAddTable = async () => {
    if (!newTableNumber) return;
    
    // Prevent duplicate table numbers
    if (tables.some(t => t.number === newTableNumber)) {
      alert(`Table number ${newTableNumber} already exists! / លេខតុ ${newTableNumber} មានរួចហើយ!`);
      return;
    }

    try {
      await createTable({
        number: newTableNumber,
        status: 'available',
        capacity: 4
      });
      setNewTableNumber('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await deleteTable(id);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const getTableStatus = (tableNumber: string): 'available' | 'occupied' => {
    const isBusy = activeOrders.some(order => order.tableNumber === tableNumber);
    return isBusy ? 'occupied' : 'available';
  };

  const filteredTables = tables.filter(t => t.number.includes(search));

  const stats = [
    { label: 'Total Tables / តុសរុប', value: tables.length, icon: QrCode, color: 'bg-stone-50 text-stone-600' },
    { label: 'Occupied / មានភ្ញៀវ', value: tables.filter(t => getTableStatus(t.number) === 'occupied').length, icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'Available / ទំនេរ', value: tables.filter(t => getTableStatus(t.number) === 'available').length, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Table Management / ការគ្រប់គ្រងតុ</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Manage restaurant layout and generate QR codes for digital ordering.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
        >
          <Plus className="w-5 h-5" />
          Add New Table / បន្ថែមតុថ្មី
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-100 shadow-xl max-w-md mx-auto"
        >
          <h2 className="text-xl font-bold mb-6">Add New Table / បន្ថែមតុថ្មី</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Table Number / លេខតុ</label>
              <input
                type="text"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                placeholder="e.g. 1, 2, A1..."
                className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200 transition-all"
              >
                Cancel / បោះបង់
              </button>
              <button 
                onClick={handleAddTable}
                className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-100"
              >
                Create Table / បង្កើតតុ
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-stat[0] rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="Search tables... / ស្វែងរកតុ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
          {filteredTables.map((table) => {
            const currentStatus = getTableStatus(table.number);
            return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all group relative"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === table.id ? null : table.id)}
                  className={`p-2 rounded-xl transition-all ${
                    activeMenuId === table.id ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {activeMenuId === table.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setActiveMenuId(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-100 z-20 overflow-hidden"
                      >
                        <button 
                          onClick={() => {
                            handleDeleteTable(table.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Table / លុបតុ
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="w-24 h-24 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-stone-100 group-hover:border-amber-200 transition-colors">
                <QrCode className="w-12 h-12 text-stone-300 group-hover:text-amber-600 transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-stone-900 text-center">Table {table.number}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  currentStatus === 'available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}></div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  currentStatus === 'available' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {currentStatus === 'available' ? 'Available / ទំនេរ' : 'Occupied / មានភ្ញៀវ'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-8">
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/order/${table.number}`;
                      navigator.clipboard.writeText(url);
                      alert(`Browser QR Link copied: ${url}`);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 bg-stone-50 text-stone-600 rounded-xl text-[10px] font-bold hover:bg-stone-100 transition-all border border-stone-100"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Web Link
                  </button>
                  <a 
                    href={`/order/${table.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-stone-50 text-stone-600 rounded-xl text-[10px] font-bold hover:bg-stone-100 transition-all border border-stone-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live View
                  </a>
                </div>
                <button 
                  onClick={() => {
                    const url = `https://t.me/${TELEGRAM_BOT_USERNAME}/app?startapp=${table.number}`;
                    navigator.clipboard.writeText(url);
                    alert(`Telegram Deep Link copied: ${url}\n Use this for your bot buttons!`);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
                >
                  <QrCode className="w-4 h-4" />
                  Copy Telegram Bot Link
                </button>
              </div>

            </motion.div>
          )})}
          {filteredTables.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No tables found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
