import axios from 'axios';
import type { AuthResponse, User } from '../types/auth';
// Crear instancia de axios
const api = axios.create({ baseURL: '/auth' });

// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// Solicitar login
export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/login', { email, password });
  return data;
};

// Solicitar registro
export const registerRequest = async (nombre: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/register', { nombre, email, password });
  return data;
};

// Obtener datos del usuario
export const meRequest = async () => {
  const { data } = await api.get<User>('/me');
  return data;
};
