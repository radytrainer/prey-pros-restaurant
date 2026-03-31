import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  MoreVertical,
  MapPin,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscribeToIngredients, createIngredient } from '../services/firebaseService';
import type { Ingredient } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    stockLevel: 0,
    minStockLevel: 0,
    unit: 'kg',
    supplier: ''
  });

  useEffect(() => {
    const unsubscribe = subscribeToIngredients(setIngredients);
    return () => unsubscribe();
  }, []);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIngredient(newIngredient);
      setIsAddModalOpen(false);
      setNewIngredient({
        name: '',
        stockLevel: 0,
        minStockLevel: 0,
        unit: 'kg',
        supplier: ''
      });
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = ingredients.filter(i => i.stockLevel <= i.minStockLevel).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Inventory Management / ការគ្រប់គ្រងសន្និធិ</h1>
          <p className="text-stone-500 mt-1">Track and manage your kitchen supplies.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors shadow-md shadow-amber-200"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient / បន្ថែមគ្រឿងផ្សំ
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-stone-900">Add Ingredient / បន្ថែមគ្រឿងផ្សំ</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-xl transition-colors">
                    <Plus className="w-6 h-6 rotate-45 text-stone-400" />
                  </button>
                </div>
                
                <form onSubmit={handleAddIngredient} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Name / ឈ្មោះ</label>
                    <input 
                      required
                      type="text" 
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      placeholder="e.g. Jasmine Rice"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Stock / ចំនួន</label>
                      <input 
                        required
                        type="number" 
                        value={newIngredient.stockLevel}
                        onChange={(e) => setNewIngredient({...newIngredient, stockLevel: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Min Stock / ចំនួនអប្បបរមា</label>
                      <input 
                        required
                        type="number" 
                        value={newIngredient.minStockLevel}
                        onChange={(e) => setNewIngredient({...newIngredient, minStockLevel: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Unit / ឯកតា</label>
                      <select 
                        value={newIngredient.unit}
                        onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                        <option value="box">box</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Supplier / អ្នកផ្គត់ផ្គង់</label>
                      <input 
                        required
                        type="text" 
                        value={newIngredient.supplier}
                        onChange={(e) => setNewIngredient({...newIngredient, supplier: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none"
                        placeholder="e.g. Lee's Food"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 mt-4"
                  >
                    Add Ingredient / បន្ថែម
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Total Items / មុខទំនិញសរុប</p>
              <p className="text-2xl font-bold text-stone-900">{ingredients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Low Stock Alert / ការជូនដំណឹងទំនិញជិតអស់</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Stock Value / តម្លៃសរុបក្នុងសន្និធិ</p>
              <p className="text-2xl font-bold text-stone-900">$4,250.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="Search inventory... / ស្វែងរកក្នុងសន្និធិ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>
          <button className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Ingredient / គ្រឿងផ្សំ</th>
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Stock Level / កម្រិតសន្និធិ</th>
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Unit / ឯកតា</th>
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Supplier / អ្នកផ្គត់ផ្គង់</th>
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status / ស្ថានភាព</th>
                <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredIngredients.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{item.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">ID: {item.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.stockLevel <= item.minStockLevel ? 'text-red-500' : 'text-stone-900'}`}>
                        {item.stockLevel}
                      </span>
                      {item.stockLevel <= item.minStockLevel ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-stone-600">{item.unit}</td>
                  <td className="px-8 py-5 text-sm text-stone-600">{item.supplier}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.stockLevel <= item.minStockLevel 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.stockLevel <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-stone-50">
          {filteredIngredients.map((item) => (
            <div key={item.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-stone-900">{item.name}</h3>
                  <p className="text-xs text-stone-400">ID: {item.id.slice(0, 8)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.stockLevel <= item.minStockLevel 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {item.stockLevel <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stock Level</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`font-bold ${item.stockLevel <= item.minStockLevel ? 'text-red-500' : 'text-stone-900'}`}>
                      {item.stockLevel} {item.unit}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Supplier</p>
                  <p className="text-sm text-stone-600 mt-1 font-medium">{item.supplier}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="px-8 py-20 text-center">
            <Package className="w-16 h-16 text-stone-100 mx-auto mb-4" />
            <p className="text-stone-400 font-medium">No ingredients found. / រកមិនឃើញគ្រឿងផ្សំ</p>
          </div>
        )}
      </div>
    </div>
  );
};
