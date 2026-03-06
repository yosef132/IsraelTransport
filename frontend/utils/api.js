import axios from 'axios';

const api = axios.create({
  baseURL: 'https://israeltransport.onrender.com/api',
});

export default api;
