import axios from 'axios';
import type { PaginatedResponse, RequestItem, RequestFilters } from '../types/request';
import type { RequestFormData, EditRequestData } from '../types/request-form';

// Crear instancia de axios con la URL base
const api = axios.create({ baseURL: '/solicitudes' });
// Interceptor para agregar el token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper para mapear inglés → español
const mapFormToBody = (data: RequestFormData | EditRequestData) => ({
  fecha: data.date, tipo: data.type, descripcion: data.description,
  estado: data.status, nombre: data.clientName, email: data.clientEmail, telefono: data.clientPhone,
});

// Obtiene las solicitudes paginadas desde el backend con filtros opcionales
export const getRequests = async (page: number, pageSize: number, filters?: RequestFilters) => {
  const { data } = await api.get<PaginatedResponse>('/', { params: { page, pageSize, ...filters } });
  return data;
};

// Crea una nueva solicitud
export const createRequest = async (data: RequestFormData) => {
  const { data: res } = await api.post<RequestItem>('/', mapFormToBody(data));
  return res;
};

// Edita una solicitud (puede modificar cualquier campo)
export const editRequest = async (id: number, data: EditRequestData) => {
  const body: Record<string, unknown> = {};
  if (data.date !== undefined) body.fecha = data.date;
  if (data.type !== undefined) body.tipo = data.type;
  if (data.description !== undefined) body.descripcion = data.description;
  if (data.status !== undefined) body.estado = data.status;
  if (data.clientName !== undefined) body.nombre = data.clientName;
  if (data.clientEmail !== undefined) body.email = data.clientEmail;
  if (data.clientPhone !== undefined) body.telefono = data.clientPhone;
  const { data: res } = await api.put<RequestItem>(`/${id}`, body);
  return res;
};

// Elimina una solicitud
export const deleteRequest = async (id: number) => {
  await api.delete(`/${id}`);
};
