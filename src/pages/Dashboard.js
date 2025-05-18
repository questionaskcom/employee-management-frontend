import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../auth';
import api from '../axiosConfig';
import MainLayout from '../layouts/MainLayout';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();

  const [departmentData, setDepartmentData] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/api/dashboard');
      setDepartmentData(res.data.departments || []);
      setRecentProjects(res.data.recentProjects || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setLoading(false);
  };

  const pieData = {
    labels: departmentData.map((d) => d.name),
    datasets: [
      {
        label: 'Employees',
        data: departmentData.map((d) => d.employeeCount),
        backgroundColor: [
          '#007bff', '#6610f2', '#6f42c1', '#e83e8c',
          '#dc3545', '#fd7e14', '#ffc107', '#198754',
        ],
      },
    ],
  };

  return (
    <MainLayout>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div>Loading data...</div>
        </div>
      ) : (
        <div className="p-4">
          {/* Top Flex Section: Left Text, Right Chart */}
          <div
            className="d-flex justify-content-between align-items-start"
            style={{ minHeight: '400px', gap: '2rem' }}
          >
            {/* Left Text */}
            <div style={{ flex: '1' }}>
              <h2>Welcome to EMS Dashboard</h2>
              <p className="mt-3">
                This dashboard provides insights into employee distribution by department.
                The chart on the right shows how many employees belong to each department.

              </p>
            </div>

            {/* Right Fixed Chart */}
            <div
              className="bg-white shadow rounded p-3"
              style={{ width: '500px', height: '600px', flexShrink: 0 }}
            >
              <h5 className="text-center mb-3">Department Distribution</h5>
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={300}
              />
            </div>
          </div>

          {/* Bottom Section: Recent Projects Table */}
          <div className="mt-5">
            <h4>Last 5 Created Projects</h4>
            <div className="table-responsive mt-3">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>{new Date(project.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No recent projects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Dashboard;
