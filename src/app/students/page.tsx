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
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Students</h1>
      </div>

      <CreateStudentForm />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {students?.map((student) => (
            <li key={student.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">{student.name}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-medium bg-gray-100 text-gray-800">
                    Ref: {student.referralCode}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700">
                    Spent: ₹{student.totalSpent}
                  </span>
                </div>
              </div>
              
              <Link
                href={`/students/${student.id}`}
                className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 font-medium py-2 px-4 rounded-xl transition-all text-sm"
              >
                View Details
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
          
          {students?.length === 0 && (
            <li className="p-12 text-center">
              <p className="text-gray-500 text-lg">No students found.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
