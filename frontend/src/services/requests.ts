import axios from 'axios';
import type { RawRequest, RawPaginatedResponse, RequestItem, PaginatedResponse } from '../types/request';

// Crea la instancia de axios con la URL base
const api = axios.create({ baseURL: '/solicitudes' });

// Interceptor para incluir el token en las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// Mapea la solicitud cruda desde el backend a la solicitud tipada
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
// Obtiene las solicitudes paginadas desde el backend
export const getRequests = async (page: number, pageSize: number) => {
  const { data } = await api.get<RawPaginatedResponse>('/', { params: { page, pageSize } });
  return {
    data: data.data.map(mapRequest), // mapea las solicitudes crudas a las solicitudes tipadas
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
  } satisfies PaginatedResponse;
};

// Actualiza una solicitud existente
export const updateRequest = async (id: number, data: Partial<{ estado: string }>) => {
  const response = await api.put<RawRequest>(`/${id}`, data);
  return mapRequest(response.data);
};
