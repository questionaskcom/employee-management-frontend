import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.questionask.com/api/', 
});

export default api;
