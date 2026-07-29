import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CreateRequestModalProps, CreateFieldErrors } from '../types/create-request-modal';
import type { AutocompleteResult } from '../types/clients';
import { validateRequestForm } from '../hooks/useRequests';
import { autocompleteClient } from '../services/clients';

export default function CreateRequestModal({ onSave, onClose }: CreateRequestModalProps) {
  const [rut, setRut] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDIENTE');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<CreateFieldErrors>({});
  // Autocomplete state
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Autocomplete: detecta RUT o email y consulta al backend
  useEffect(() => {
    const q = rut.trim() || clientEmail.trim();
    if (!q || q.length < 3) {
      setAutoError('');
      return;
    }

    // Cancela petición anterior
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAutoLoading(true);
    setAutoError('');

    const timer = setTimeout(async () => {
      try {
        const result: AutocompleteResult = await autocompleteClient(q, controller.signal);
        // Solo auto-completa si los campos están vacíos o si el usuario no los ha modificado
        setClientName((prev) => prev || result.name);
        setClientEmail((prev) => prev || result.email);
        setClientPhone((prev) => prev || result.phone);
        setAutoError('');
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        if (err.response?.status === 404) {
          setAutoError('Cliente no encontrado');
        } else if (err.code === 'ECONNABORTED') {
          setAutoError('La consulta excedió el tiempo de espera');
        } else {
          setAutoError('Error al consultar');
        }
      } finally {
        setAutoLoading(false);
      }
    }, 400); // debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [rut, clientEmail]);

  const handleSave = async () => {
    const validation = validateRequestForm({ clientName, clientEmail, clientPhone, date, type, description });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSaving(true);
    try {
      await onSave({ date, type, description, status, clientName, clientEmail, clientPhone });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (error?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Nueva solicitud</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador y error de autocompletado */}
        {autoLoading && (
          <div className="flex items-center gap-2 mb-4 text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            Buscando datos del cliente...
          </div>
        )}
        {autoError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {autoError}
          </div>
        )}

        <div className="space-y-4">
          {/* RUT o email (consulta a API externa) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">RUT / Email</label>
            <input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12345678-9 o email" className={inputClass()} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cliente</label>
            <input value={clientName} onChange={(e) => { setClientName(e.target.value); setErrors((p) => ({ ...p, clientName: undefined })); }} className={inputClass(errors.clientName)} />
            {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <input value={clientEmail} onChange={(e) => { setClientEmail(e.target.value); setErrors((p) => ({ ...p, clientEmail: undefined })); }} className={inputClass(errors.clientEmail)} />
            {errors.clientEmail && <p className="text-xs text-red-500 mt-1">{errors.clientEmail}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
            <input value={clientPhone} onChange={(e) => { setClientPhone(e.target.value); setErrors((p) => ({ ...p, clientPhone: undefined })); }} placeholder="+56912345678" className={inputClass(errors.clientPhone)} />
            {errors.clientPhone && <p className="text-xs text-red-500 mt-1">{errors.clientPhone}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha</label>
            <input type="date" value={date} min={today} onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: undefined })); }} className={inputClass(errors.date)} />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de solicitud</label>
            <input value={type} onChange={(e) => { setType(e.target.value); setErrors((p) => ({ ...p, type: undefined })); }} className={inputClass(errors.type)} />
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }} rows={3} className={inputClass(errors.description) + ' resize-none'} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition-colors">
            {saving ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
