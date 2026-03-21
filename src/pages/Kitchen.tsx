import React, { useEffect, useState } from 'react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Utensils,
  Loader2
} from 'lucide-react';
import { subscribeToOrders, updateOrderStatus } from '../services/firebaseService';
import type { Order, OrderStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'preparing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ready': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-stone-50 text-stone-500 border-stone-100';
    }
  };

  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, currentStatus: OrderStatus) => {
    if (loadingOrderId) return;
    
    let nextStatus: OrderStatus;
    switch (currentStatus) {
      case 'pending': nextStatus = 'preparing'; break;
      case 'preparing': nextStatus = 'ready'; break;
      case 'ready': nextStatus = 'completed'; break;
      default: return;
    }

    setLoadingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, nextStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Kitchen Display System / ប្រព័ន្ធបង្ហាញក្នុងផ្ទះបាយ</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Manage and track live orders in real-time.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-stone-100 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {orders.filter(o => o.status === 'pending').length} Pending / កំពុងរង់ចាំ
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap">
            <ChefHat className="w-4 h-4" />
            {orders.filter(o => o.status === 'preparing').length} Preparing / កំពុងរៀបចំ
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4" />
            {orders.filter(o => o.status === 'ready').length} Ready / រួចរាល់
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {activeOrders.map((order, i) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group"
            >
              <div className={`p-6 border-b flex items-center justify-between ${getStatusColor(order.status)}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Table {order.tableNumber}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{order.status}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/30 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-50 text-gray-900 font-bold rounded-lg flex items-center justify-center text-sm border border-gray-100">
                        {item.quantity}
                      </span>
                      <p className="font-semibold text-gray-700">{item.name}</p>
                    </div>
                    {order.status === 'preparing' && (
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50/50 border-t border-gray-50 mt-auto">
                <div className="flex items-center justify-between mb-6 text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p>ID: {order.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  disabled={loadingOrderId === order.id}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    order.status === 'pending' ? 'bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600' :
                    order.status === 'preparing' ? 'bg-amber-600 text-white shadow-amber-100 hover:bg-amber-700' :
                    'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700'
                  }`}
                >
                  {loadingOrderId === order.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : order.status === 'pending' ? (
                    <>
                      <Play className="w-5 h-5" />
                      Start Cooking / ចាប់ផ្ដើមចម្អិន
                    </>
                  ) : order.status === 'preparing' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Ready / រួចរាល់
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-5 h-5" />
                      Complete Order / បញ្ចប់ការកម្ម៉ង់
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {activeOrders.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Orders</h3>
            <p className="text-gray-500">The kitchen is currently quiet. New orders will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
