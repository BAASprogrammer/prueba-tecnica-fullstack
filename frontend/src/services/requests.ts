import axios from 'axios';
import type { RequestItem } from '../types/request';

const api = axios.create({ baseURL: '/api/solicitudes' });
// Interceptor para incluir el token en las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Estructura de solicitud cruda que viene del backend
interface RawRequest {
  id: number;
  numero: string;
  fecha: string;
  tipo: string;
  descripcion: string;
  estado: string;
  clienteId: number;
  cliente: {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
  };
}

// Función que mapea la solicitud cruda a la solicitud tipada
const mapRequest = (r: RawRequest): RequestItem => ({
  id: r.id,
  number: r.numero,
  date: r.fecha,
  type: r.tipo,
  description: r.descripcion,
  status: r.estado,
  clientId: r.clienteId,
  client: {
    id: r.cliente.id,
    name: r.cliente.nombre,
    email: r.cliente.email,
    phone: r.cliente.telefono,
  },
});

// Función que obtiene las solicitudes
export const getRequests = async () => {
  const { data } = await api.get<RawRequest[]>('/');
  return data.map(mapRequest);
};
