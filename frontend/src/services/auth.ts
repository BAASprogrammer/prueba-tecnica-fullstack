import axios from 'axios';

// Crear instancia de axios con la URL base
const api = axios.create({ baseURL: '/auth' });
// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Solicitar login
export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post('/login', { email, password });
  return data;
};

// Solicitar registro
export const registerRequest = async (nombre: string, email: string, password: string) => {
  const { data } = await api.post('/register', { nombre, email, password });
  return data;
};

// Obtener datos del usuario
export const meRequest = async () => {
  const { data } = await api.get('/me');
  return data;
};
