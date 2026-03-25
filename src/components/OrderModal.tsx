'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, createOrder } from '../lib/api';
import { useAppStore } from '../store';

const schema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(5, 'Maximum 5 items per order'),
});

type FormValues = z.infer<typeof schema>;

export default function CanteenOrderModal() {
  const isOrderModalOpen = useAppStore((state) => state.isOrderModalOpen);
  const setOrderModalOpen = useAppStore((state) => state.setOrderModalOpen);
  const selectedSnackId = useAppStore((state) => state.selectedSnackId);
  const setSelectedSnackId = useAppStore((state) => state.setSelectedSnackId);
  
  const queryClient = useQueryClient();

  // Fetch students, enabled only when modal is open to avoid unnecessary requests on initial load
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    enabled: isOrderModalOpen,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 }
  });

  const closeModal = useCallback(() => {
    setOrderModalOpen(false);
    setSelectedSnackId(null);
  }, [setOrderModalOpen, setSelectedSnackId]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!selectedSnackId) throw new Error('No snack selected');
      return createOrder(data.studentId, selectedSnackId, data.quantity);
    },
    onSuccess: () => {
      // Invalidate all related queries to update counts, amounts, and histories!
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Introduce a slight delay before closing so the success message is visible
      setTimeout(() => {
        closeModal();
      }, 700);
    },
  });

  useEffect(() => {
    if (isOrderModalOpen) {
      reset();
      mutation.reset();
    }
  }, [isOrderModalOpen, reset, mutation.reset]);

  if (!isOrderModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-orange-500/60 backdrop-blur-sm transition-opacity" 
        onClick={closeModal}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Place Order</h2>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <div>
            <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Student
            </label>
            <select
              id="studentId"
              className={`w-full px-4 py-3 bg-gray-50 border text-gray-900 font-medium rounded-xl outline-none transition-all focus:ring-4 ${
                errors.studentId ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-50'
              }`}
              {...register('studentId')}
            >
              <option value="" disabled>Choose a student...</option>
              {loadingStudents ? (
                <option value="" disabled>Loading students...</option>
              ) : (
                students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.referralCode})
                  </option>
                ))
              )}
            </select>
            {errors.studentId && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.studentId.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Max: 5</span>
            </div>
            
            <input
              id="quantity"
              type="number"
              min="1"
              max="5"
              className={`w-full px-4 py-3 bg-gray-50 border text-gray-900 font-medium rounded-xl outline-none transition-all focus:ring-4 ${
                errors.quantity ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-50'
              }`}
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-2 text-sm text-red-500 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {mutation.isSuccess ? (
              <div className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-green-200 flex justify-center items-center overflow-hidden">
                <svg className="w-5 h-5 mr-2 animate-bounce flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Order Confirmed!
              </div>
            ) : (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-orange-200 flex justify-center items-center"
              >
                {mutation.isPending ? 'Processing Order...' : 'Confirm Order'}
              </button>
            )}
            
            <button
              type="button"
              onClick={closeModal}
              disabled={mutation.isSuccess || mutation.isPending}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            {mutation.isError && (
              <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mt-2 text-center">
                Failed to place order. Please try again.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
