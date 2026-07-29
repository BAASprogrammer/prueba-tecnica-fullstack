import { FileText, Clock, CheckCheck, Play } from 'lucide-react';
import type { Props } from '../types/dashboard';

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Solicitudes</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
          <Clock className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pendientes</p>
          <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
          <CheckCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Finalizadas</p>
          <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Play className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">En proceso</p>
          <p className="text-xl font-bold text-gray-900">{stats.inProgress}</p>
        </div>
      </div>
    </div>
  );
}
