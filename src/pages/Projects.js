import { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { getToken } from '../auth';
import MainLayout from '../layouts/MainLayout';

function Project() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', employee_ids: [] });

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get('/api/projects', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setProjects(res.data);
  };

  const fetchEmployees = async () => {
    const res = await api.get('/api/employees', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/projects', form, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setForm({ name: '', description: '', employee_ids: [] });
    fetchProjects();
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    await api.put(`/api/tasks/${taskId}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchProjects();
  };

  const handleAddTask = async (projectId) => {
    const title = prompt('Task title');
    if (!title) return;

    const userIdsInput = prompt('Assign user IDs (comma separated)');
    const user_ids = userIdsInput ? userIdsInput.split(',').map(id => id.trim()) : [];

    await api.post('/api/tasks', {
      project_id: projectId,
      title,
      user_ids,
      status: 'pending',
    }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    fetchProjects();
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2>Projects</h2>

        <form onSubmit={handleSubmit} className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="form-control mb-2"
            multiple
            value={form.employee_ids}
            onChange={(e) =>
              setForm({
                ...form,
                employee_ids: Array.from(e.target.selectedOptions, (opt) => opt.value),
              })
            }
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary">Add Project</button>
        </form>

        {projects.map((project) => (
          <div key={project.id} className="mb-4 border p-3 rounded">
            <h4>{project.name}</h4>
            <p>{project.description}</p>

            {project.employees?.length > 0 && (
              <div>
                <strong>Assigned Employees:</strong>
                <ul>
                  {project.employees.map((emp) => (
                    <li key={emp.id}>{emp.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <ul>
              {project.tasks?.map((task) => (
                <li key={task.id}>
                  {task.title} &nbsp;
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="done">Done</option>
                  </select>
                  {task.users?.length > 0 && (
                    <ul>
                      {task.users.map((user) => (
                        <li key={user.id} style={{ fontSize: '0.85em', marginLeft: '1rem' }}>
                          👤 {user.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleAddTask(project.id)}
              className="btn btn-sm btn-outline-secondary mt-2"
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default Project;
