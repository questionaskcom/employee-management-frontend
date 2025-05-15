// src/axios.js
import axios from 'axios';

axios.defaults.baseURL = 'https://api.questionask.com/';
axios.defaults.withCredentials = true;

export default axios;
