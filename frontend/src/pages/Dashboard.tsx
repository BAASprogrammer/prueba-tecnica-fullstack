import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Loader2, ChevronLeft, ChevronRight, Pencil, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRequests } from '../services/requests';
import type { RequestItem } from '../types/request';
import { requestStatus } from '../constants/requestStatus';

const PAGE_SIZE = 4;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getRequests(page, PAGE_SIZE).then((res) => {
      setRequests(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Panel Principal</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="hidden sm:inline text-gray-700 font-medium">{user?.nombre}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-5 border-b bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Gestión de solicitudes</h2>
            <p className="text-sm text-gray-500 mt-0.5">{total} solicitudes registradas</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No hay solicitudes</p>
              <p className="text-sm mt-1">Aún no se han registrado solicitudes en el sistema.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Número</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Fecha</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Cliente</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200 hidden md:table-cell">Email</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200 hidden lg:table-cell">Teléfono</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200 hidden md:table-cell">Tipo</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Descripción</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Estado</th>
                    <th className="px-4 py-2.5 text-left font-semibold border-b border-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => {
                    const e = requestStatus[r.status] || requestStatus.PENDIENTE;
                    const Icon = e.icon;
                    return (
                      <tr
                        key={r.id}
                        className={`transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-indigo-50/40`}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">
                          {r.number}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap border-b border-gray-200">
                          {new Date(r.date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap border-b border-gray-200">
                          {r.client.name}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell whitespace-nowrap border-b border-gray-200">
                          {r.client.email}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell whitespace-nowrap font-mono text-xs border-b border-gray-200">
                          {r.client.phone}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700 hidden md:table-cell whitespace-nowrap border-b border-gray-200">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            {r.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 max-w-xs border-b border-gray-200">
                          <button
                            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                            className="text-left text-gray-600 hover:text-gray-900 cursor-pointer"
                          >
                            <span className={expanded === r.id ? '' : 'line-clamp-1'}>
                              {r.description}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap border-b border-gray-200">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${e.bg}`}>
                            <Icon className="w-3 h-3" />
                            {e.label}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-gray-200 bg-gray-50/50">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        p === page
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 bg-white border hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
