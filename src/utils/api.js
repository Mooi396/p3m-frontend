import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Menempelkan token otomatis ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Harus sama dengan key di authSlice
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;