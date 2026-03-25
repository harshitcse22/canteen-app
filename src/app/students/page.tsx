'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../../lib/api';
import Link from 'next/link';
import CreateStudentForm from '../../components/CreateStudentForm';

export default function StudentsPage() {
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  if (isLoading) return <div className="p-8 text-center text-lg text-gray-500 animate-pulse">Loading students...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading students!</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          <span className="bg-gradient-to-br from-white to-gray-50 px-6 py-2.5 rounded-2xl shadow-md border border-gray-200 inline-block">
            Students
          </span>
        </h1>
      </div>

      <CreateStudentForm />

      {students?.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
          <p className="text-gray-500 text-xl font-medium">No students found. Add one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-red-100 text-orange-700 rounded-2xl flex items-center justify-center text-2xl font-black mb-4 shadow-inner border border-orange-100/50">
                  {student.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{student.name}</h2>
                <div className="flex gap-2">
                  <span className="bg-gray-50 text-gray-600 text-xs font-extrabold px-3 py-1.5 rounded-lg border border-gray-200 tracking-widest shadow-sm">
                    REF: {student.referralCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Total Spent</p>
                  <p className="text-xl font-black text-green-600">₹{student.totalSpent}</p>
                </div>
                <Link
                  href={`/students/${student.id}`}
                  className="bg-orange-500 group-hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md flex items-center active:scale-95"
                >
                  Details
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
