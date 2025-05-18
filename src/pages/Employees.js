import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth';
import MainLayout from '../layouts/MainLayout';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ New state for departments
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', department: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    } else {
      fetchEmployees();
      fetchDepartments(); // ✅ Also fetch departments
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.questionask.com/api/employees', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('https://api.questionask.com/api/departments', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `https://api.questionask.com/api/employees/${editingId}`
      : `https://api.questionask.com/api/employees`;

    const method = editingId ? 'put' : 'post';

    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setForm({ name: '', email: '', department: '', phone: '' });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department, // should match `department_name` in backend if needed
      phone: employee.phone || '',
    });
    setEditingId(employee.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`https://api.questionask.com/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchEmployees();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <MainLayout>
      <h2 className="mb-4">Employee Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              name="department"
              className="form-control"
              value={form.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.department_name}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Phone"
              value={form.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-12 mt-3">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Update' : 'Add'} Employee
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.phone || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </MainLayout>
  );
}

export default Employees;
