export interface ClientItem {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Respuesta del endpoint de autocompletado
export interface AutocompleteResult {
  source: 'local' | 'external';
  id?: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  rut?: string;
}
