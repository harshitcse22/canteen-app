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
        <Link href="/students" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Students
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-indigo-50 p-8 mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Referral Code:</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 font-semibold rounded text-sm">{student.referralCode}</span>
            </div>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-100/50 px-8 py-5 rounded-2xl text-center shadow-sm w-full sm:w-auto">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1.5 opacity-80">Total Spent</p>
            <p className="text-4xl font-black text-emerald-700 tracking-tight">₹{student.totalSpent}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
        <Link 
          href="/snacks" 
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm"
        >
          Place New Order
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
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
                    <td className="py-4 px-6 font-bold text-emerald-600">₹{order.payableAmount}</td>
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
