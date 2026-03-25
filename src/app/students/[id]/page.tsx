'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStudentById, getOrdersByStudent } from '../../../lib/api';
import Link from 'next/link';

export default function StudentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['students', id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrdersByStudent(id),
    enabled: !!id,
  });

  if (loadingStudent || loadingOrders) return <div className="p-8 text-center text-lg text-gray-500 animate-pulse">Loading details...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="mb-6">
        <Link href="/students" className="text-sm font-medium text-orange-600 hover:text-orange-800 flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Students
        </Link>
      </div>

      <div className="bg-gradient-to-br from-orange-600 to-red-800 rounded-[2rem] shadow-xl p-8 sm:p-10 mb-6 overflow-hidden relative text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.03] rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-900 opacity-20 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black shadow-inner border border-white/10 shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-md">{student.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-black/20 backdrop-blur-sm text-orange-50 border border-white/10 font-bold rounded-xl text-xs tracking-widest shadow-sm">
                  REF: {student.referralCode}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-[2rem] text-center shadow-lg w-full sm:w-auto">
            <p className="text-[11px] text-orange-100 font-extrabold uppercase tracking-widest mb-1 shadow-sm">Total Spent</p>
            <p className="text-5xl sm:text-6xl font-black text-white drop-shadow-md">₹{student.totalSpent}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-10 bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-inner">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center drop-shadow-sm">
          <span className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-200 mr-3"> Order History</span>
        </h2>
        <Link
          href="/snacks"
          className="bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-100 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md flex items-center w-full sm:w-auto justify-center active:scale-95 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Place New Order
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Snack</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider text-center">Quantity</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-800">{order.snackName}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded inline-block min-w-8">{order.quantity}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-green-600">₹{order.payableAmount}</td>
                    <td className="py-4 px-6 text-gray-400 text-sm font-medium text-right">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-5 ring-1 ring-gray-100 shadow-sm">
              <span className="text-3xl opacity-80">🍽️</span>
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-2">No orders found.</p>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">This student hasn't ordered anything yet. Click the button above to place their first order!</p>
          </div>
        )}
      </div>
    </div>
  );
}
