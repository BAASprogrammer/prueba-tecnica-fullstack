import type { RequestItem } from './request';

// Datos del formulario de edición
export interface EditRequestData {
  date?: string;
  type?: string;
  description?: string;
  status?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

// Props del modal de edición
export interface EditRequestModalProps {
  request: RequestItem;
  onSave: (id: number, data: EditRequestData) => Promise<void>;
  onClose: () => void;
}

// Errores de validación del formulario
export interface FieldErrors {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  date?: string;
  type?: string;
  description?: string;
}
