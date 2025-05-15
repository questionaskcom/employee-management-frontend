import React, { useEffect, useState } from 'react';
import api from '../api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get('/employees').then(response => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>{emp.name} - {emp.position}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
