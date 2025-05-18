import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../auth';
import MainLayout from '../layouts/MainLayout';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ department_name: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    } else {
      fetchDepartments();
    }
  }, [navigate]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.questionask.com/api/departments', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `https://api.questionask.com/api/departments/${editingId}`
      : `https://api.questionask.com/api/departments`;

    const method = editingId ? 'put' : 'post';

    try {
      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setForm({ department_name: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const handleEdit = (department) => {
    setForm({ department_name: department.department_name });
    setEditingId(department.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`https://api.questionask.com/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchDepartments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <MainLayout>
      <h2 className="mb-4">Department Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="department_name"
              className="form-control"
              placeholder="Department Name"
              value={form.department_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Update' : 'Add'} Department
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
              <th>Department Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.department_name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(dept.id)}
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

export default Departments;
