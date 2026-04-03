import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles,
  Utensils,
  QrCode,
  Save,
  X,
  Loader2,
  Database,
  Download,
  MoreVertical,
  Filter,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  AlertCircle
} from 'lucide-react';
import { getMenuItems, getTables, createMenuItem, updateMenuItem, deleteMenuItem, createTable, updateTable, deleteTable, subscribeToTables, subscribeToOrders } from '../services/firebaseService';
import { generateMenuItemImage } from '../services/gemini';
import { SAMPLE_MENU_ITEMS } from '../constants';
import { MenuItem, Table, MenuItemIngredient, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

const getEnglishName = (name: string) => {
  const parts = name.split('/');
  return parts.find(p => /[a-zA-Z]/.test(p))?.trim() || parts[0].trim();
};

export const Admin: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'tables'>('menu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    timeCategory: 'Morning',
    isAvailable: true,
    ingredients: []
  });
  const [currentIngredient, setCurrentIngredient] = useState<MenuItemIngredient>({
    name: '',
    quantity: 0,
    unit: 'kg'
  });
  const [newTable, setNewTable] = useState<Partial<Table>>({
    number: '',
    status: 'available',
    capacity: 2
  });
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Main Course', 'Appetizers', 'Desserts', 'Beverages'];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'Morning': return <Sunrise className="w-3.5 h-3.5" />;
      case 'Afternoon': return <Sun className="w-3.5 h-3.5" />;
      case 'Evening': return <Sunset className="w-3.5 h-3.5" />;
      case 'Night': return <Moon className="w-3.5 h-3.5" />;
      default: return <Sun className="w-3.5 h-3.5" />;
    }
  };

  useEffect(() => {
    getMenuItems().then(setMenuItems);
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

  const getTableStatus = (tableNumber: string): 'available' | 'occupied' => {
    const isBusy = activeOrders.some(order => order.tableNumber === tableNumber);
    return isBusy ? 'occupied' : 'available';
  };

  const handleAddIngredient = () => {
    if (!currentIngredient.name || currentIngredient.quantity <= 0) return;
    setNewItem(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), currentIngredient]
    }));
    setCurrentIngredient({ name: '', quantity: 0, unit: 'kg' });
  };

  const handleRemoveIngredient = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index)
    }));
  };

  const handleGenerateImage = async () => {
    if (!newItem.name) return;
    setIsGenerating(true);
    try {
      const englishName = getEnglishName(newItem.name);
      const url = await generateMenuItemImage(englishName);
      if (url) setNewItem(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSeedData = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    try {
      for (const item of SAMPLE_MENU_ITEMS) {
        await createMenuItem(item);
      }
      const updatedItems = await getMenuItems();
      setMenuItems(updatedItems);
      alert('Sample data added successfully! / បញ្ចូលទិន្នន័យគំរូបានជោគជ័យ!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Failed to seed data. / បរាជ័យក្នុងការបញ្ចូលទិន្នន័យ។');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSaveItem = async () => {
    if (!newItem.name || !newItem.price) return;

    // Check for duplicate title
    const isDuplicate = menuItems.some(item => 
      item.name.trim().toLowerCase() === newItem.name?.trim().toLowerCase() && 
      item.id !== editingMenuItemId
    );

    if (isDuplicate) {
      alert('This food title already exists! / ឈ្មោះម្ហូបនេះមានរួចហើយ!');
      return;
    }
    try {
      if (editingMenuItemId) {
        await updateMenuItem(editingMenuItemId, newItem);
      } else {
        await createMenuItem(newItem as Omit<MenuItem, 'id'>);
      }
      const updatedItems = await getMenuItems();
      setMenuItems(updatedItems);
      setIsModalOpen(false);
      setEditingMenuItemId(null);
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        timeCategory: 'Morning',
        isAvailable: true,
        ingredients: []
      });
      setCurrentIngredient({ name: '', quantity: 0, unit: 'kg' });
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingMenuItemId(item.id);
    setNewItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item? / តើអ្នកប្រាកដជាចង់លុបមុខម្ហូបនេះមែនទេ?')) return;
    try {
      await deleteMenuItem(id);
      const updatedItems = await getMenuItems();
      setMenuItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSaveTable = async () => {
    if (!newTable.number) return;
    try {
      if (editingTableId) {
        await updateTable(editingTableId, newTable);
      } else {
        await createTable(newTable as Omit<Table, 'id'>);
      }
      const updatedTables = await getTables();
      setTables(updatedTables);
      setIsTableModalOpen(false);
      setEditingTableId(null);
      setNewTable({ number: '', status: 'available', capacity: 2 });
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table? / តើអ្នកប្រាកដជាចង់លុបតុនេះមែនទេ?')) return;
    try {
      await deleteTable(id);
      const updatedTables = await getTables();
      setTables(updatedTables);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const downloadQRCode = (tableNumber: string) => {
    const svg = document.getElementById(`qr-table-${tableNumber}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `table-${tableNumber}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Admin Management / ការគ្រប់គ្រង</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Configure your restaurant settings and menu. / កំណត់រចនាសម្ព័ន្ធភោជនីយដ្ឋាន និងបញ្ជីមុខម្ហូបរបស់អ្នក។</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-stone-100 shadow-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'menu' ? 'bg-amber-600 text-white shadow-md shadow-amber-100' : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu Management / គ្រប់គ្រងបញ្ជីមុខម្ហូប
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'tables' ? 'bg-amber-600 text-white shadow-md shadow-amber-100' : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Table & QR / តុ និង QR
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative group flex-1 w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items... / ស្វែងរកមុខម្ហូប..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm shadow-sm"
              />
            </div>
            
            <div className="flex bg-white p-1 rounded-2xl border border-stone-100 shadow-sm overflow-x-auto no-scrollbar gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-100' 
                      : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={handleSeedData}
                disabled={isSeeding}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-all disabled:opacity-50"
              >
                {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                Seed Data / បញ្ចូលទិន្នន័យ
              </button>
              <button 
                onClick={() => {
                  setEditingMenuItemId(null);
                  setNewItem({
                    name: '',
                    description: '',
                    price: 0,
                    category: 'Main Course',
                    timeCategory: 'Morning',
                    isAvailable: true,
                    ingredients: []
                  });
                  setCurrentIngredient({ name: '', quantity: 0, unit: 'kg' });
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
              >
                <Plus className="w-5 h-5" />
                Add Menu Item / បន្ថែមមុខម្ហូប
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.map((item) => {
                const nameParts = item.name.split('/');
                const englishName = getEnglishName(item.name);
                const isKhmerFirst = /[\u1780-\u17FF]/.test(nameParts[0]);
                const khmerPart = isKhmerFirst ? nameParts[0].trim() : (nameParts[1]?.trim() || '');
                
                const displayTitle = khmerPart && englishName && khmerPart !== englishName 
                  ? `${khmerPart} / ${englishName}` 
                  : item.name;

                const rawImg = item.imageUrl || ((item as any).image?.startsWith('http') ? (item as any).image : '');
                const finalImage = rawImg && !rawImg.includes('unsplash.com') 
                  ? rawImg 
                  : `https://image.pollinations.ai/prompt/${encodeURIComponent(englishName + ' delicious food cinematic')}?width=200&height=200&nologo=true`;

                const isDuplicate = menuItems.filter(i => i.name.toLowerCase() === item.name.toLowerCase()).length > 1;

                return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id} 
                  className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-100/50 transition-all flex flex-col gap-4 group relative"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-100 relative bg-stone-50">
                      <img 
                        src={finalImage} 
                        alt={displayTitle} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://image.pollinations.ai/prompt/${encodeURIComponent(englishName + ' delicious food cinematic')}?width=200&height=200&nologo=true`;
                        }}
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest rotate-[-15deg] border border-white/40 px-2 py-0.5 rounded">Unavailable</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{item.category}</span>
                          </div>
                          <h3 
                            className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight" 
                            title={displayTitle}
                          >
                            {displayTitle}
                          </h3>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === item.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setActiveMenuId(null)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-stone-100 z-20 overflow-hidden"
                                >
                                  <button 
                                    onClick={() => {
                                      handleEditItem(item);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-stone-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Item
                                  </button>
                                  <button 
                                    onClick={() => {
                                      handleDeleteMenuItem(item.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-stone-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Item
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">${item.price}</span>
                        {item.timeCategory && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-100">
                            {getTimeIcon(item.timeCategory)}
                            {item.timeCategory}
                          </span>
                        )}
                        {isDuplicate && (
                          <div className="group/tip relative">
                            <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-stone-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity whitespace-nowrap z-30">
                              Duplicate Name Detected!
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 bg-stone-50/50 p-2 rounded-xl border border-stone-50">
                      {item.description}
                    </p>
                  )}

                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ing, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 bg-white text-stone-500 rounded-full border border-stone-100 shadow-sm font-medium">
                          {ing.name}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-400 rounded-full font-bold">
                          +{item.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )})}
            </AnimatePresence>
            {filteredMenuItems.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                  <Search className="w-8 h-8 text-stone-300" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">No dishes found / រកមិនឃើញមុខម្ហូប</h3>
                <p className="text-stone-500 text-sm mt-1">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tables.map((table) => {
            const currentStatus = getTableStatus(table.number);
            return (
            <div key={table.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-amber-200 transition-all relative">
              <div className="absolute top-3 right-3">
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === table.id ? null : table.id)}
                    className="p-1.5 bg-white/80 backdrop-blur-sm text-stone-400 hover:text-amber-600 rounded-lg transition-all border border-stone-100 shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
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
                          className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                        >
                          <button 
                            onClick={() => {
                              setEditingTableId(table.id);
                              setNewTable(table);
                              setIsTableModalOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Table
                          </button>
                          <button 
                            onClick={() => {
                              handleDeleteTable(table.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Table
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900">Table {table.number}</h3>
              <p className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                currentStatus === 'available' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {currentStatus === 'available' ? 'Available / ទំនេរ' : 'Occupied / មានភ្ញៀវ'}
              </p>
              <button 
                onClick={() => {
                  setEditingTableId(table.id);
                  setNewTable(table);
                  setIsTableModalOpen(true);
                }}
                className="mt-4 text-xs font-bold text-amber-600 hover:underline"
              >
                View QR Code
              </button>
            </div>
          )})}
          <button 
            onClick={() => {
              setEditingTableId(null);
              setNewTable({ number: '', status: 'available', capacity: 2 });
              setIsTableModalOpen(true);
            }}
            className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-100 hover:border-amber-200 hover:text-amber-600 transition-all"
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-bold">Add Table</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900">{editingMenuItemId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Item Name / ឈ្មោះមុខម្ហូប</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      placeholder="e.g. Wagyu Beef Burger"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Time Category / ពេលវេលា</label>
                    <select
                      value={newItem.timeCategory}
                      onChange={(e) => setNewItem(prev => ({ ...prev, timeCategory: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    >
                      <option value="Morning">Morning / ពេលព្រឹក</option>
                      <option value="Afternoon">Afternoon / ពេលថ្ងៃ</option>
                      <option value="Evening">Evening / ពេលល្ងាច</option>
                      <option value="Night">Night / ពេលយប់</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Category / ប្រភេទ</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    >
                      <option>Main Course</option>
                      <option>Appetizers</option>
                      <option>Desserts</option>
                      <option>Beverages</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price ($) / តម្លៃ ($)</label>
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-end pb-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newItem.isAvailable}
                          onChange={(e) => setNewItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                          className="w-5 h-5 rounded-lg border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm font-bold text-gray-700">Available / មានក្នុងស្តុក</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description / ការពិពណ៌នា</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all h-32 resize-none"
                      placeholder="Describe the dish..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Item Image / រូបភាព</label>
                    <div className="relative group aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {newItem.imageUrl ? (
                        <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 font-medium">No image generated yet</p>
                        </div>
                      )}
                      <button
                        onClick={handleGenerateImage}
                        disabled={isGenerating || !newItem.name}
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        AI Generate Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                  <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    Ingredients Management / គ្រប់គ្រងគ្រឿងផ្សំ
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Ingredient name..."
                        value={currentIngredient.name}
                        onChange={(e) => setCurrentIngredient(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={currentIngredient.quantity || ''}
                        onChange={(e) => setCurrentIngredient(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                        className="w-full px-4 py-2.5 bg-white border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={currentIngredient.unit}
                        onChange={(e) => setCurrentIngredient(prev => ({ ...prev, unit: e.target.value }))}
                        className="flex-1 px-4 py-2.5 bg-white border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                      </select>
                      <button
                        onClick={handleAddIngredient}
                        className="p-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md shadow-amber-100"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {newItem.ingredients?.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-100 rounded-lg text-xs font-medium text-stone-600 shadow-sm">
                        <span>{ing.name}</span>
                        <span className="text-amber-600 font-bold">{ing.quantity}{ing.unit}</span>
                        <button 
                          onClick={() => handleRemoveIngredient(idx)}
                          className="p-0.5 hover:bg-stone-50 rounded text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(!newItem.ingredients || newItem.ingredients.length === 0) && (
                      <p className="text-xs text-stone-400 italic">No ingredients added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-200"
                >
                  <Save className="w-5 h-5" />
                  Save Menu Item
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Table Management Modal */}
        {isTableModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTableModalOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTableId ? 'Edit Table' : 'Add New Table'}
                </h2>
                <button onClick={() => setIsTableModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Table Number</label>
                  <input
                    type="text"
                    value={newTable.number}
                    onChange={(e) => setNewTable(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    placeholder="e.g. 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                  />
                </div>

                {newTable.number && (
                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Table QR Code</p>
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                      <QRCodeSVG 
                        id={`qr-table-${newTable.number}`}
                        value={`${window.location.origin}/order/${newTable.number}`}
                        size={160}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <button 
                      onClick={() => downloadQRCode(newTable.number!)}
                      className="flex items-center gap-2 text-amber-600 text-xs font-bold hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG
                    </button>
                    <p className="mt-4 text-[10px] text-stone-400 text-center">
                      Link: {window.location.origin}/order/{newTable.number}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTable}
                  className="flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-200"
                >
                  <Save className="w-5 h-5" />
                  Save Table
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
