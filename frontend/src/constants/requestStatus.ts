import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const requestStatus: Record<string, { label: string; bg: string; icon: LucideIcon }> = {
  PENDIENTE: { label: 'Pendiente', bg: 'bg-amber-50 text-amber-700 ring-amber-200', icon: Circle },
  EN_PROCESO: { label: 'En proceso', bg: 'bg-blue-50 text-blue-700 ring-blue-200', icon: Clock },
  FINALIZADA: { label: 'Finalizada', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
  RECHAZADA: { label: 'Rechazada', bg: 'bg-red-50 text-red-700 ring-red-200', icon: XCircle },
};
