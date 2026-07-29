export interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

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

export interface RawClient {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface RawRequest {
  id: number;
  numero: string;
  fecha: string;
  tipo: string;
  descripcion: string;
  estado: string;
  clienteId: number;
  cliente: RawClient;
}

export interface RawPaginatedResponse {
  data: RawRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse {
  data: RequestItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
}
