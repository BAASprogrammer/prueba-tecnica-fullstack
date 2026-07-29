import { useAuth } from '../hooks/useAuth';
import { LogOut, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRequests, updateRequest, deleteRequest } from '../services/requests';
import type { RequestItem } from '../types/request';
import RequestsTable from '../components/RequestsTable';

const PAGE_SIZE = 4;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Hook para obtener las solicitudes
  useEffect(() => {
    // Establece la carga a true
    setLoading(true);
    // Obtiene las solicitudes
    getRequests(page, PAGE_SIZE).then((res) => {
      // Actualiza la lista de solicitudes
      setRequests(res.data);
      // Actualiza el número total de páginas
      setTotalPages(res.totalPages);
      // Actualiza el número total de solicitudes
      setTotal(res.total);
      // Establece la carga a false
    }).finally(() => setLoading(false));
    // Se ejecuta cuando cambia la página
  }, [page]);

  // Estado para confirmar el cierre de una solicitud
  const [confirmId, setConfirmId] = useState<number | null>(null);
  // Maneja el cierre de una solicitud
  const handleCloseRequest = async (id: number) => {
    // Busca la solicitud por ID
    const req = requests.find((r) => r.id === id);
    // Si no encuentra la solicitud, retorna
    if (!req) return;
    // Si la solicitud ya está cerrada, muestra un mensaje de error
    if (req.status === 'FINALIZADA') {
      setMessage({ type: 'error', text: 'La solicitud ya está cerrada.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    // Si la solicitud no está cerrada, establece el ID de la solicitud para confirmar el cierre
    setConfirmId(id);
  };
  // Estado para confirmar la eliminación de una solicitud
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  // Maneja la eliminación de una solicitud
  const handleDeleteRequest = (id: number) => setDeleteConfirmId(id);
  // Confirma la eliminación de una solicitud
  const confirmDelete = async () => {
    // Si no hay un ID de solicitud para eliminar, retorna
    if (!deleteConfirmId) return;
    try {
      // Elimina la solicitud
      await deleteRequest(deleteConfirmId);
      // Actualiza la lista de solicitudes
      setRequests((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      // Actualiza el número total de solicitudes
      setTotal((prev) => prev - 1);
      // Actualiza el número total de páginas
      const newTotalPages = Math.ceil((total - 1) / PAGE_SIZE);
      // Si la página actual es mayor que el número total de páginas, establece la página actual al número total de páginas
      if (page > newTotalPages && newTotalPages > 0) setPage(newTotalPages);
      // Muestra un mensaje de éxito
      setMessage({ type: 'success', text: 'Solicitud eliminada correctamente.' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Error al eliminar la solicitud.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Confirma el cierre de una solicitud
  const confirmClose = async () => {
    // Si no hay un ID de solicitud para confirmar, retorna
    if (!confirmId) return;
    try {
      // Actualiza la solicitud
      const updated = await updateRequest(confirmId, { estado: 'FINALIZADA' });
      // Actualiza la lista de solicitudes
      setRequests((prev) => prev.map((r) => (r.id === confirmId ? updated : r)));
      // Muestra un mensaje de éxito
      setMessage({ type: 'success', text: 'Solicitud cerrada correctamente.' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      // Muestra un mensaje de error
      setMessage({ type: 'error', text: 'Error al cerrar la solicitud.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      // Limpia el ID de la solicitud para confirmar el cierre
      setConfirmId(null);
    }
  };

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
        {message && (
          <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar solicitud</h3>
              <p className="text-sm text-gray-600 mb-6">¿Estás seguro de que deseas eliminar esta solicitud?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de cierre */}
        {confirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cerrar solicitud</h3>
              <p className="text-sm text-gray-600 mb-6">¿Estás seguro de que deseas cerrar esta solicitud?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  No
                </button>
                <button
                  onClick={confirmClose}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-colors"
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}
        <RequestsTable
          requests={requests}
          loading={loading}
          total={total}
          page={page}
          totalPages={totalPages}
          expanded={expanded}
          onPageChange={setPage}
          onToggleExpand={setExpanded}
          onCloseRequest={handleCloseRequest}
          onDeleteRequest={handleDeleteRequest}
        />
      </main>
    </div>
  );
}
