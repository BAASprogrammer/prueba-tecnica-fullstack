import { useState, useEffect, useCallback } from 'react';
import { getRequests, updateRequest, deleteRequest } from '../services/requests';
import type { RequestItem } from '../types/request';
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

  // Obtiene las solicitudes al cambiar de página
  useEffect(() => {
    // Muestra indicador de carga
    setLoading(true);
    // Obtiene las solicitudes
    getRequests(page, PAGE_SIZE).then((res) => {
      // Actualiza el estado de las solicitudes
      setRequests(res.data);
      // Actualiza el número total de páginas
      setTotalPages(res.totalPages);
      // Actualiza el número total de solicitudes
      setTotal(res.total);
    }).finally(() => setLoading(false));
  }, [page]);

  // Maneja el cierre de una solicitud
  const handleCloseRequest = useCallback((id: number) => {
    // Busca la solicitud por su ID
    const req = requests.find((r) => r.id === id);
    // Si no se encuentra la solicitud, no hace nada
    if (!req) return;
    // Si la solicitud ya está cerrada, muestra un mensaje de error
    if (req.status === 'FINALIZADA') {
      showMessage('error', 'La solicitud ya está cerrada.');
      return;
    }
    setConfirmId(id);
  }, [requests, showMessage]);

  // Confirma el cierre de la solicitud
  const confirmClose = useCallback(async () => {
    // Si no hay ID de solicitud, no hace nada
    if (!confirmId) return;
    try {
      // Actualiza el estado de la solicitud
      const updated = await updateRequest(confirmId, { estado: 'FINALIZADA' });
      // Actualiza la lista de solicitudes
      setRequests((prev) => prev.map((r) => (r.id === confirmId ? updated : r)));
      // Muestra un mensaje de éxito
      showMessage('success', 'Solicitud cerrada correctamente.');
      // Actualiza las estadísticas
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
      // Elimina la solicitud
      await deleteRequest(deleteConfirmId);
      // Actualiza la lista de solicitudes
      setRequests((prev) => prev.filter((r) => r.id !== deleteConfirmId));
      // Actualiza el número total de solicitudes
      setTotal((prev) => {
        // Disminuye el número total de solicitudes
        const newTotal = prev - 1;
        // Calcula el número total de páginas
        const newTotalPages = Math.ceil(newTotal / PAGE_SIZE);
        // Si la página actual es mayor que el número total de páginas, actualiza la página
        if (page > newTotalPages && newTotalPages > 0) setPage(newTotalPages);
        return newTotal;
      });
      // Muestra un mensaje de éxito
      showMessage('success', 'Solicitud eliminada correctamente.');
      // Actualiza las estadísticas
      refreshStats();
    } catch {
      // Muestra un mensaje de error
      showMessage('error', 'Error al eliminar la solicitud.');
    } finally {
      // Limpia el ID de la solicitud para confirmar la eliminación
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, page, showMessage, refreshStats]);

  // Retorna los valores del hook
  return {
    requests, loading, page, totalPages, total, expanded,
    setPage, setExpanded, setTotal,
    confirmId, deleteConfirmId,
    handleCloseRequest, confirmClose, setConfirmId,
    handleDeleteRequest, confirmDelete, setDeleteConfirmId,
  };
}
