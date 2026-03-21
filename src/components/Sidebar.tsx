import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  Package, 
  ChefHat, 
  BarChart3, 
  Settings, 
  LogOut,
  Users,
  QrCode,
  Truck
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, logout, isAdmin, isStaff } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard / ផ្ទាំងគ្រប់គ្រង', show: true },
    { to: '/menu', icon: Utensils, label: 'Menu / បញ្ជីមុខម្ហូប', show: true },
    { to: '/inventory', icon: Package, label: 'Inventory / សន្និធិ', show: isStaff },
    { to: '/kitchen', icon: ChefHat, label: 'Kitchen / ផ្ទះបាយ', show: isStaff },
    { to: '/reports', icon: BarChart3, label: 'Reports / របាយការណ៍', show: isAdmin },
    { to: '/tables', icon: QrCode, label: 'Tables / តុ', show: isAdmin },
    { to: '/suppliers', icon: Truck, label: 'Suppliers / អ្នកផ្គត់ផ្គង់', show: isStaff },
    { to: '/admin', icon: Settings, label: 'Admin / ការកំណត់', show: isAdmin },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col h-screen z-50 transition-transform duration-300 lg:translate-x-0 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                <Utensils className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">Prey Pros</h1>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 rotate-180" />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.filter(item => item.show).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-amber-50 text-amber-600 font-medium shadow-sm" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  "group-[.active]:text-amber-600"
                )} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3 mb-6 px-2">
              <img 
                src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=random`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{profile?.displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
