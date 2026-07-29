import axios from 'axios';
import type { DashboardStats } from '../types/dashboard';
// Crear instancia de axios
const api = axios.create({ baseURL: '/dashboard' });
// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  // obtener el token
  const token = localStorage.getItem('token');
  // si el token existe agregarlo a la cabecera
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // devolver la configuracion
  return config;
});

// Obtiene las estadísticas
export const getStats = async () => {
  // obtener las estadísticas
  const { data } = await api.get<DashboardStats>('/');
  // devolver las estadísticas
  return data;
};
