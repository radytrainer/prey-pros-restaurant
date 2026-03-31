import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Menu, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { subscribeToOrders } from '../services/firebaseService';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { profile, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((orders) => {
      setPendingOrdersCount(orders.filter(o => o.status === 'pending').length);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="Search... / ស្វែងរក..."
              className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5" />
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
              {pendingOrdersCount}
            </span>
          )}
        </button>
        <div className="h-8 w-px bg-gray-100 mx-1 sm:mx-2"></div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{profile?.displayName}</p>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{profile?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 shrink-0 group-hover:border-amber-200 transition-colors">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-bold text-gray-900">{profile?.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
                <div className="p-2">
                  <Link 
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4" />
                    View Profile / មើលព័ត៌មានផ្ទាល់ខ្លួន
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all">
                    <Settings className="w-4 h-4" />
                    Settings / ការកំណត់
                  </button>
                </div>
                <div className="p-2 border-t border-gray-50">
                  <button 
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out / ចាកចេញ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
