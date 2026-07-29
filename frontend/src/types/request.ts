// Información del cliente
export interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}
// Solicitud
export interface RequestItem {
  id: number;
  number: string;
  date: string;
  type: string;
  description: string;
  status: string;
  clientId: number;
  client: ClientInfo;
}
// Respuesta paginada
export interface PaginatedResponse {
  data: RequestItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filtros para la búsqueda de solicitudes
export interface RequestFilters {
  search: string;
  status: string;
  orderBy: 'asc' | 'desc';
}

// Props del componente RequestsTable
export interface PropsRequestsTable {
  requests: RequestItem[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  expanded: number | null;
  onPageChange: (page: number) => void;
  onToggleExpand: (id: number | null) => void;
  onCloseRequest: (id: number) => void;
  onDeleteRequest: (id: number) => void;
}
