import axios from 'axios';
import type { RawPaginatedResponse, PaginatedResponse, RequestItem } from '../types/request';

// Crea la instancia de axios con la URL base
const api = axios.create({ baseURL: '/solicitudes' });

// Interceptor para incluir el token en las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Obtiene las solicitudes paginadas desde el backend
export const getRequests = async (page: number, pageSize: number) => {
  const { data } = await api.get<RawPaginatedResponse>('/', { params: { page, pageSize } });
  return {
    data: data.data as RequestItem[],
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
  } satisfies PaginatedResponse;
};

// Actualiza una solicitud existente
export const updateRequest = async (id: number, data: Partial<{ estado: string }>) => {
  const response = await api.put<RequestItem>(`/${id}`, data);
  return response.data;
};

// Elimina una solicitud
export const deleteRequest = async (id: number) => {
  await api.delete(`/${id}`);
};
