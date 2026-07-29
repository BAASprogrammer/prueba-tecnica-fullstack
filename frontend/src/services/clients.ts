import axios from 'axios';
import type { ClientItem, AutocompleteResult } from '../types/clients';

// Crear instancia de axios con la URL base y timeout global
const api = axios.create({ baseURL: '/clientes', timeout: 6000 });
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

// Autocompletar datos de cliente consultando API externa por RUT o email
// Recibe un AbortSignal para cancelar la petición en curso
export const autocompleteClient = async (query: string, signal?: AbortSignal) => {
  const { data } = await api.get<AutocompleteResult>('/autocomplete', {
    params: { query },
    signal,
  });
  return data;
};
