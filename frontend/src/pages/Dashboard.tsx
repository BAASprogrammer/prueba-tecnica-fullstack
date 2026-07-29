import { useAuth } from '../hooks/useAuth';
import { LogOut, User, CheckCircle2, AlertCircle, Search, ArrowUpDown, Plus, Lock } from 'lucide-react';
import RequestsTable from '../components/RequestsTable';
import StatsCards from '../components/StatsCards';
import EditRequestModal from '../components/EditRequestModal';
import CreateRequestModal from '../components/CreateRequestModal';
import { useDashboard } from '../hooks/useDashboard';
import { useRequests } from '../hooks/useRequests';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useTabLock } from '../hooks/useTabLock';

export default function Dashboard() {
  // Hook de autenticación
  const { user, logout } = useAuth();
  // Hook de estadísticas del dashboard
  const { stats, refreshStats } = useDashboard();
  // Hook de mensajes flash
  const { message, showMessage } = useFlashMessage();
  // Hook de bloqueo entre pestañas
  const { lockedCreate, lockedEditIds, acquireLock, releaseLock } = useTabLock();
  // Hook de gestión de solicitudes
  const {
    requests, loading, page, totalPages, total, expanded, filters, editRequestItem, showCreateModal,
    setPage, setExpanded, setShowCreateModal, updateFilters,
    confirmId, deleteConfirmId,
    handleCloseRequest, confirmClose, setConfirmId,
    handleDeleteRequest, confirmDelete, setDeleteConfirmId,
    handleEditRequest, saveEditRequest, setEditRequestItem,
    handleCreateRequest,
  } = useRequests(refreshStats, showMessage);

  // Abrir modal de creación con bloqueo entre pestañas
  const openCreateModal = () => {
    acquireLock('create');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    releaseLock('create');
    setShowCreateModal(false);
  };

  // Abrir modal de edición con bloqueo entre pestañas
  const openEditModal = (id: number) => {
    acquireLock('edit', id);
    handleEditRequest(id);
  };

  const closeEditModal = () => {
    if (editRequestItem) {
      releaseLock('edit', editRequestItem.id);
    }
    setEditRequestItem(null);
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
              <span className="hidden sm:inline text-gray-700 font-medium">{user?.name}</span>
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
        {/* Mensaje flash de éxito o error */}
        {message && (
          <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        {stats && <StatsCards stats={stats} />}

        {/* Barra de búsqueda, filtro por estado y ordenamiento */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, cliente o descripción..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            {/* Filtro por estado */}
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
            {/* Botón de ordenamiento por fecha */}
            <button
              onClick={() => updateFilters({ orderBy: filters.orderBy === 'desc' ? 'asc' : 'desc' })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              title={filters.orderBy === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
            >
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">{filters.orderBy === 'desc' ? 'Más reciente' : 'Más antiguo'}</span>
            </button>
            {/* Botón para añadir solicitud */}
            <button
              onClick={openCreateModal}
              disabled={lockedCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title={lockedCreate ? 'Otra pestaña está creando una solicitud' : 'Añadir solicitud'}
            >
              {lockedCreate ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="hidden sm:inline">{lockedCreate ? 'Bloqueado' : 'Añadir Solicitud'}</span>
            </button>
          </div>
        </div>

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

        {/* Modal de creación de solicitud */}
        {showCreateModal && (
          <CreateRequestModal
            onSave={handleCreateRequest}
            onClose={closeCreateModal}
          />
        )}
        {/* Modal de edición de solicitud */}
        {editRequestItem && (
          <EditRequestModal
            request={editRequestItem}
            onSave={saveEditRequest}
            onClose={closeEditModal}
          />
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
        {/* Tabla de solicitudes */}
        <RequestsTable
          requests={requests}
          loading={loading}
          total={total}
          page={page}
          totalPages={totalPages}
          expanded={expanded}
          disabledEditIds={lockedEditIds}
          onPageChange={setPage}
          onToggleExpand={setExpanded}
          onCloseRequest={handleCloseRequest}
          onDeleteRequest={handleDeleteRequest}
          onEditRequest={openEditModal}
        />
      </main>
    </div>
  );
}
