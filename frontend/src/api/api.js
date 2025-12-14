import axios from "axios";

// Cambia esta URL si usas Render/Vercel en el despliegue
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor: agrega token automáticamente a cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;