import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { EditRequestModalProps } from '../types/edit-request-modal';

export default function EditRequestModal({ request, onSave, onClose }: EditRequestModalProps) {
  const [clientName, setClientName] = useState(request.client.name);
  const [clientEmail, setClientEmail] = useState(request.client.email);
  const [clientPhone, setClientPhone] = useState(request.client.phone);
  const [date, setDate] = useState(request.date.slice(0, 10));
  const [type, setType] = useState(request.type);
  const [description, setDescription] = useState(request.description);
  const [status, setStatus] = useState(request.status);
  const [saving, setSaving] = useState(false);
  // Guardar los cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(request.id, { date, type, description, status, clientName, clientEmail, clientPhone });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Editar solicitud <span className="text-indigo-600">{request.number}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Campo Cliente */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Cliente</label>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          {/* Campo Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          {/* Campo Teléfono */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
            <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          {/* Campo Fecha */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          {/* Campo Tipo */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo de solicitud</label>
            <input value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          {/* Campo Descripción */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
          </div>
          {/* Campo Estado */}
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
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
