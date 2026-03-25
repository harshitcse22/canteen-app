'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../lib/api';

const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

type FormValues = z.infer<typeof schema>;

export default function CreateStudentForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => createStudent(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 w-full md:w-1/2">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-4 py-2 border rounded-xl focus:ring-4 outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-50'
              }`}
            placeholder="e.g. John Doe"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-2 px-4 rounded-xl transition-colors flex justify-center items-center"
        >
          {mutation.isPending ? 'Adding...' : 'Add Student'}
        </button>
        {mutation.isError && (
          <p className="mt-2 text-sm font-medium text-red-500 bg-red-50 p-2 rounded">An error occurred while adding student.</p>
        )}
      </form>
    </div>
  );
}
