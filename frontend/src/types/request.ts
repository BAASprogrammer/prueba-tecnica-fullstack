import type { ClientItem } from './clients';

// Solicitud
export interface RequestItem {
  id: number;
  number: string;
  date: string;
  type: string;
  description: string;
  status: string;
  clientId: number;
  client: ClientItem;
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
  disabledEditIds: Set<number>;
  onPageChange: (page: number) => void; // cambiar página
  onToggleExpand: (id: number | null) => void; // expandir/colapsar detalles de solicitud
  onCloseRequest: (id: number) => void; // cerrar solicitud
  onDeleteRequest: (id: number) => void; // eliminar solicitud
  onEditRequest: (id: number) => void; // editar solicitud
}
