import { useState, useEffect, useCallback } from 'react';
import { getRequests, deleteRequest, editRequest } from '../services/requests';
import type { RequestItem, RequestFilters } from '../types/request';
import type { EditRequestData } from '../types/edit-request-modal';

// Tamaño de la página
const PAGE_SIZE = 4;

// Hook para obtener y manejar las solicitudes
export function useRequests(refreshStats: () => void, showMessage: (type: 'success' | 'error', text: string) => void) {
  // Estado de las solicitudes
  const [requests, setRequests] = useState<RequestItem[]>([]);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de la paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  // Estado de la descripción expandida
  const [expanded, setExpanded] = useState<number | null>(null);
  // Estado de los modales de confirmación
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  // Estado del modal de edición
  const [editRequestItem, setEditRequestItem] = useState<RequestItem | null>(null);
  // Filtros de búsqueda
  const [filters, setFilters] = useState<RequestFilters>({ search: '', status: '', orderBy: 'desc' });

  // Reinicia la página al cambiar los filtros
  const updateFilters = useCallback((newFilters: Partial<RequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  // Obtiene las solicitudes al cambiar de página o filtros
  useEffect(() => {
    setLoading(true);
    getRequests(page, PAGE_SIZE, filters).then((res) => {
      setRequests(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    }).finally(() => setLoading(false));
  }, [page, filters]);

  // Maneja el cierre de una solicitud
  const handleCloseRequest = useCallback((id: number) => {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    if (req.status === 'FINALIZADA') {
      showMessage('error', 'La solicitud ya está cerrada.');
      return;
    }
    setConfirmId(id);
  }, [requests, showMessage]);

  // Confirma el cierre de la solicitud
  const confirmClose = useCallback(async () => {
    if (!confirmId) return;
    try {
      const updated = await editRequest(confirmId, { status: 'FINALIZADA' });
      setRequests((prev) => prev.map((r) => (r.id === confirmId ? updated : r)));
      showMessage('success', 'Solicitud cerrada correctamente.');
      refreshStats();
    } catch {
      showMessage('error', 'Error al cerrar la solicitud.');
    } finally {
      setConfirmId(null);
    }
  }, [confirmId, showMessage, refreshStats]);

  // Maneja la eliminación de una solicitud
  const handleDeleteRequest = useCallback((id: number) => setDeleteConfirmId(id), []);

  // Confirma la eliminación de la solicitud
  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteRequest(deleteConfirmId);
      setRequests((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      setTotal((prev) => {
        const newTotal = prev - 1;
        const newTotalPages = Math.ceil(newTotal / PAGE_SIZE);
        if (page > newTotalPages && newTotalPages > 0) setPage(newTotalPages);
        return newTotal;
      });
      showMessage('success', 'Solicitud eliminada correctamente.');
      refreshStats();
    } catch {
      showMessage('error', 'Error al eliminar la solicitud.');
    } finally {
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, page, showMessage, refreshStats]);

  // Maneja la edición de una solicitud
  const handleEditRequest = useCallback((id: number) => {
    const req = requests.find((r) => r.id === id);
    if (req) setEditRequestItem(req);
  }, [requests]);

  // Guarda los cambios de la edición
  const saveEditRequest = useCallback(async (id: number, data: EditRequestData) => {
    try {
      const updated = await editRequest(id, data);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showMessage('success', 'Solicitud actualizada correctamente.');
      setEditRequestItem(null);
      refreshStats();
    } catch {
      showMessage('error', 'Error al actualizar la solicitud.');
    }
  }, [showMessage, refreshStats]);

  // Retorna los valores del hook
  return {
    requests, loading, page, totalPages, total, expanded, filters, editRequestItem,
    setPage, setExpanded, setTotal, updateFilters,
    confirmId, deleteConfirmId,
    handleCloseRequest, confirmClose, setConfirmId,
    handleDeleteRequest, confirmDelete, setDeleteConfirmId,
    handleEditRequest, saveEditRequest, setEditRequestItem,
  };
}
