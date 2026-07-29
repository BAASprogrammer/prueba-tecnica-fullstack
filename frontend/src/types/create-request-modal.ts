import type { FieldErrors } from './edit-request-modal';

// Datos del formulario de creación
export interface CreateRequestData {
  date: string;
  type: string;
  description: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

// Props del modal de creación
export interface CreateRequestModalProps {
  onSave: (data: CreateRequestData) => Promise<void>;
  onClose: () => void;
}

export type { FieldErrors as CreateFieldErrors };
