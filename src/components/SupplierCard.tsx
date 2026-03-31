import React from 'react';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Navigation,
  Clock,
  ExternalLink,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';

export interface Supplier {
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  website?: string;
  hours?: string;
  category?: string;
  mapsUri?: string;
}

interface SupplierCardProps {
  supplier: Supplier;
  index?: number;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[24px] border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-amber-100">
              {supplier.category || 'Supplier'}
            </span>
            {supplier.rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">{supplier.rating}</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-amber-600 transition-colors">
            {supplier.name}
          </h3>
        </div>
        <div className="p-2 bg-stone-50 text-stone-300 rounded-xl">
          <Truck className="w-4 h-4" />
        </div>
      </div>

      {supplier.mapsUri && (
        <a 
          href={supplier.mapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full h-32 mb-4 rounded-2xl overflow-hidden group/map border border-stone-100"
        >
          <img 
            src={`https://image.pollinations.ai/prompt/${encodeURIComponent('map satellite view ' + supplier.name)}?width=400&height=200&nologo=true`}
            alt="Map preview"
            className="w-full h-full object-cover grayscale opacity-50 group-hover/map:grayscale-0 group-hover/map:opacity-100 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/5 group-hover/map:bg-transparent transition-colors">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-amber-600 transform group-hover/map:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-stone-500 uppercase tracking-wider shadow-sm">
            Click to open map
          </div>
        </a>
      )}

      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-stone-300 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-stone-500 leading-relaxed">{supplier.address}</p>
        </div>

        {supplier.hours && (
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-stone-300 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-stone-500 leading-relaxed">{supplier.hours}</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-stone-50 space-y-3">
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-stone-50 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all">
            <Phone className="w-3.5 h-3.5" />
            Call
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-stone-50 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all">
            <Globe className="w-3.5 h-3.5" />
            Website
          </button>
        </div>
        
        {supplier.mapsUri && (
          <a 
            href={supplier.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-stone-200"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        )}
      </div>
    </motion.div>
  );
};
