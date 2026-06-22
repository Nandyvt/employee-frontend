export default function EmployeeTable({ employees, loading }) {
  if (loading) {
    return <p className="text-gray-500 mt-6">Loading employees...</p>;
  }

  if (!employees.length) {
    return <p className="text-gray-500 mt-6">No employees found. Add one to get started.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">First Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Last Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Department</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Salary</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Hire Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{emp.id}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.first_name}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.last_name}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.department_name ?? '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.salary}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{emp.hire_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
