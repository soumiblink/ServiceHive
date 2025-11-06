import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach token if exists (optional but recommended)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
