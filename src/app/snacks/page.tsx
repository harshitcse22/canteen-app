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
    <div className="max-w-5xl mx-auto p-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          <span className="bg-gradient-to-br from-white to-gray-50 px-6 py-2.5 rounded-2xl shadow-md border border-gray-200 inline-block">
            Canteen Snacks
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {snacks?.map((snack) => (
          <div key={snack.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group flex flex-col">
            <div className="p-7 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{snack.name}</h2>
                <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm font-extrabold px-4 py-1.5 rounded-xl shadow-sm border border-green-200/50">
                  ₹{snack.price}
                </span>
              </div>

              <div className="flex justify-between items-end mt-auto pt-8">
                <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-0.5">Total Orders</span>
                  <span className="text-2xl font-black text-orange-600">{snack.ordersCount}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedSnackId(snack.id);
                    setOrderModalOpen(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-100 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md group-hover:shadow-orange-200 active:scale-95"
                >
                  Order Now
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
