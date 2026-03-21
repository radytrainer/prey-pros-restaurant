import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { SupplierCard, type Supplier } from '../components/SupplierCard';

export const Suppliers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('wholesale food suppliers');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Initial search with provided data as a starting point if no results
    const initialData: Supplier[] = [
      {
        name: "Lee's Food Service Ltd",
        address: "No. 262B St. 598, Phnom Penh, Cambodia",
        rating: 4.1,
        category: "Wholesaler",
        hours: "8:00 AM - 8:00 PM (Daily)",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Lee%27s+Food+Service+Ltd+Phnom+Penh"
      },
      {
        name: "Lee's Food Warehouse",
        address: "Phnom Penh, Cambodia",
        rating: 3.6,
        category: "Wholesaler",
        hours: "M-F 8:00 AM - 5:00 PM, Sat 8:00 AM - 3:00 PM",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Lee%27s+Food+Warehouse+Phnom+Penh"
      },
      {
        name: "Sela Pepper Cambodia",
        address: "66c Preah Sihanouk Blvd (274), Phnom Penh, Cambodia",
        rating: 4.8,
        category: "Manufacturer",
        hours: "M-Sat 8:00 AM - 6:00 PM",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Sela+Pepper+Cambodia+Phnom+Penh"
      },
      {
        name: "Fresh Food Supply Cambodia",
        address: "Phnom Penh, Cambodia",
        category: "Wholesaler",
        hours: "Open 24 hours (Daily)",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Fresh+Food+Supply+Cambodia+Phnom+Penh"
      },
      {
        name: "Happy Dragon Farm",
        address: "House 202 ផ្លូវ, Phnom Penh 12302, Cambodia",
        rating: 4.8,
        category: "Food Store",
        hours: "7:00 AM - 6:00 PM (Daily)",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Happy+Dragon+Farm+Phnom+Penh"
      },
      {
        name: "Bismillah Halal Food",
        address: "73Eo Street 15, Phnom Penh 120904, Cambodia",
        rating: 3.8,
        category: "Health Food Store",
        hours: "10:00 AM - 11:00 PM (Daily)",
        mapsUri: "https://www.google.com/maps/search/?api=1&query=Bismillah+Halal+Food+Phnom+Penh"
      }
    ];
    setSuppliers(initialData);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocation({ lat: 11.5564, lng: 104.9282 });
        }
      );
    } else {
      setLocation({ lat: 11.5564, lng: 104.9282 });
    }
  }, []);

  const findSuppliers = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Find 6 nearby ${searchQuery} in this area. For each, provide: name, address, rating, category (e.g. Wholesaler, Manufacturer), and opening hours.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          }
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (groundingChunks && groundingChunks.length > 0) {
        const foundSuppliers: Supplier[] = groundingChunks
          .filter(chunk => chunk.maps)
          .map(chunk => {
            const maps = chunk.maps as any;
            return {
              name: maps?.title || 'Unknown Supplier',
              address: maps?.address || 'Address available on Google Maps',
              mapsUri: maps?.uri,
              rating: maps?.rating,
              category: maps?.type || 'Supplier',
              hours: maps?.hours || 'Check Google Maps for hours'
            };
          });
        
        setSuppliers(foundSuppliers);
      } else {
        setError("No structured results found. Try a different search term.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to find suppliers. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Nearby Suppliers (AI Insights) / អ្នកផ្គត់ផ្គង់នៅជិតៗ</h1>
          <p className="text-stone-500 mt-1">Locate nearby wholesale food and equipment providers.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting Location...'}
          </span>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for suppliers (e.g., vegetable wholesale, meat market)..."
            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 text-stone-900 font-medium placeholder:text-stone-300"
            onKeyDown={(e) => e.key === 'Enter' && findSuppliers()}
          />
        </div>
        <button
          onClick={findSuppliers}
          disabled={loading || !location}
          className="bg-stone-900 text-white px-10 py-5 rounded-[24px] font-bold hover:bg-black transition-all active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Find Nearby
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {suppliers.map((supplier, i) => (
            <SupplierCard key={i} supplier={supplier} index={i} />
          ))}
        </AnimatePresence>

        {!loading && suppliers.length === 0 && !error && (
          <div className="col-span-full py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search className="w-10 h-10 text-stone-200" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">No suppliers found yet</h3>
            <p className="text-stone-500 mt-2 max-w-xs mx-auto">Enter a search term and click "Find Nearby" to locate suppliers in your area.</p>
          </div>
        )}

        {error && (
          <div className="col-span-full p-6 bg-red-50 rounded-[32px] border border-red-100 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={findSuppliers}
              className="mt-4 text-sm font-bold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
