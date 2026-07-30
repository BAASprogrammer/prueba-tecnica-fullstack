// Tipos para formulario de solicitud
export interface RequestFormData {
  date: string;
  type: string;
  description: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

// Props del modal de formulario de solicitud
export interface RequestFormModalProps {
  mode: 'create' | 'edit';
  initialData?: RequestFormData & { id: number; number: string };
  onSave: (data: RequestFormData & { id?: number }) => Promise<void>;
  onClose: () => void;
}

// Errores del formulario de solicitud
export interface FieldErrors {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  date?: string;
  type?: string;
  description?: string;
}

// Datos editados del formulario de solicitud
export type EditRequestData = Partial<RequestFormData>;
