'use client';

import { useQuery } from '@tanstack/react-query';
import { getSnacks } from '../../lib/api';
import { useAppStore } from '../../store';
import CanteenOrderModal from '../../components/OrderModal';

export default function SnacksPage() {
  const { data: snacks, isLoading, error } = useQuery({
    queryKey: ['snacks'],
    queryFn: getSnacks,
  });
  
  const setOrderModalOpen = useAppStore((state) => state.setOrderModalOpen);
  const setSelectedSnackId = useAppStore((state) => state.setSelectedSnackId);

  if (isLoading) return <div className="p-8 text-center text-lg text-gray-500 animate-pulse">Loading snacks...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading snacks!</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Canteen Snacks</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snacks?.map((snack) => (
          <div key={snack.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{snack.name}</h2>
                <span className="bg-emerald-50 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full">
                  ₹{snack.price}
                </span>
              </div>
              
              <div className="flex justify-between items-end mt-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Orders</span>
                  <span className="text-lg font-semibold text-gray-700">{snack.ordersCount}</span>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedSnackId(snack.id);
                    setOrderModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 text-white font-medium py-2 px-5 rounded-xl transition-all"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <CanteenOrderModal />
    </div>
  );
}
