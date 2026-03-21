import React from 'react';
import { useAuth } from '../components/AuthContext';
import { User, Mail, Shield, Calendar, Camera, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Header/Cover */}
        <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl">
                <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-16 h-16 text-gray-300" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-gray-600 hover:text-amber-600 transition-all opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 pb-12 px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.displayName}</h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {profile?.email}
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-stone-200">
              <Edit2 className="w-4 h-4" />
              Edit Profile / កែសម្រួលព័ត៌មាន
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Role / តួនាទី</p>
              <p className="text-lg font-bold text-stone-900 mt-1 capitalize">{profile?.role}</p>
            </div>

            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Member Since / សមាជិកតាំងពី</p>
              <p className="text-lg font-bold text-stone-900 mt-1">March 2024</p>
            </div>

            <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <User className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Status / ស្ថានភាព</p>
              <p className="text-lg font-bold text-stone-900 mt-1">Active</p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Account Details / ព័ត៌មានលម្អិតនៃគណនី</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono text-xs text-gray-400">{profile?.uid}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-gray-500">Email Verification</span>
                <span className="text-emerald-500 font-bold text-sm">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
