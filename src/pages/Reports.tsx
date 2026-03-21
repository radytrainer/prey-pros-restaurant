import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Calendar,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { getSales } from '../services/firebaseService';
import type { Sale } from '../types';
import { motion } from 'motion/react';

const salesData = [
  { name: '08:00', sales: 120 },
  { name: '10:00', sales: 340 },
  { name: '12:00', sales: 890 },
  { name: '14:00', sales: 650 },
  { name: '16:00', sales: 420 },
  { name: '18:00', sales: 1100 },
  { name: '20:00', sales: 1450 },
  { name: '22:00', sales: 820 },
];

const categoryData = [
  { name: 'Main Course', value: 45 },
  { name: 'Appetizers', value: 25 },
  { name: 'Desserts', value: 15 },
  { name: 'Beverages', value: 15 },
];

const COLORS = ['#d97706', '#10b981', '#f59e0b', '#ef4444'];

export const Reports: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    getSales().then(setSales);
  }, []);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Performance Insights / ការវិភាគលើសកម្មភាព</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Analyze your restaurant's growth and sales performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4 text-amber-600" />
            Last 30 Days / ៣០ ថ្ងៃចុងក្រោយ
            <ChevronDown className="w-4 h-4 text-stone-400" />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors shadow-md shadow-amber-200">
            <Download className="w-4 h-4" />
            Export Data / ទាញយកទិន្នន័យ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Net Revenue / ចំណូលសុទ្ធ', value: `$${totalRevenue.toLocaleString()}`, trend: '+14.2%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Avg. Order Value / តម្លៃមធ្យមនៃកម្ម៉ង់', value: '$42.50', trend: '+2.1%', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Orders / ការកម្ម៉ង់សរុប', value: '1,842', trend: '+8.4%', icon: BarChart3, color: 'text-blue-600 bg-blue-50' },
          { label: 'Customer Growth / កំណើនអតិថិជន', value: '12.5%', trend: '+5.2%', icon: Users, color: 'text-stone-600 bg-stone-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-stone-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-stone-900">Hourly Sales Distribution / ការលក់តាមម៉ោង</h2>
            <button className="p-2 text-stone-400 hover:bg-stone-50 rounded-xl transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
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
          <h2 className="text-xl font-bold text-stone-900 mb-8">Sales by Category / ការលក់តាមប្រភេទ</h2>
          <div className="flex flex-col md:flex-row items-center justify-around h-[350px]">
            <div className="w-full h-full max-w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full max-w-[200px]">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-stone-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-stone-900">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
