import { useEffect, useState } from 'react';
import EmployeeTable from './components/EmployeeTable';
import AddEmployeeModal from './components/AddEmployeeModal';
import { fetchEmployees, createEmployee, fetchDepartments } from './api/employeeApi';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    fetchDepartments()
      .then(setDepartments)
      .catch((err) => console.error('Failed to load departments', err));
  }, []);

  const handleCreateEmployee = async (formValues) => {
    setSubmitting(true);
    setServerError('');
    try {
      const created = await createEmployee(formValues);
      // Re-fetch the full list so the table reflects the real backend state
      // (including the department name resolved via the JOIN on the server) .
      await loadEmployees();
      setModalOpen(false);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create employee. Please try again.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Employee - Test
          </button>
        </div>

        <EmployeeTable employees={employees} loading={loading} />
      </div>

      <AddEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitEmployee={handleCreateEmployee}
        departments={departments}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  );
}
