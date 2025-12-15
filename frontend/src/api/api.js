import axios from "axios";

// =========================================================
// 🚨 CAMBIO CLAVE PARA DESPLIEGUE EN RENDER 🚨
// Vite carga VITE_API_URL desde .env.production
// Si no está definida (ej. en desarrollo), usa localhost
// =========================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
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