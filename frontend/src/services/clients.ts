import axios from 'axios';
import type { ClientItem } from '../types/clients';

// Crear instancia de axios con la URL base
const api = axios.create({ baseURL: '/clientes' });
// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Obtener la lista de clientes
export const getClients = async () => {
  const { data } = await api.get<ClientItem[]>('/');
  return data;
};
