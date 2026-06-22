import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function AddEmployeeModal({ open, onClose, onSubmitEmployee, departments, submitting, serverError }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      salary: '',
      department_id: '',
      hire_date: '',
    },
  });

  // Reset the form every time the modal is closed, so re-opening it
  // doesn't show stale values or validation errors from a previous attempt.
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  if (!open) return null;

  const submit = (formValues) => {
    onSubmitEmployee({
      ...formValues,
      salary: Number(formValues.salary),
      department_id: formValues.department_id ? Number(formValues.department_id) : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Add Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            ✕
          </button>
        </div>

        {serverError && (
          <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register('first_name', { required: 'First name is required' })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register('last_name', { required: 'Last name is required' })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              step="0.01"
              {...register('salary', { required: 'Salary is required', min: { value: 0, message: 'Salary must be positive' } })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.salary && <p className="mt-1 text-xs text-red-600">{errors.salary.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              {...register('department_id')}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Select department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hire Date</label>
            <input
              type="date"
              {...register('hire_date', { required: 'Hire date is required' })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.hire_date && <p className="mt-1 text-xs text-red-600">{errors.hire_date.message}</p>}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
