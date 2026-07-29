import { useState, useEffect, useCallback } from 'react';
import { getStats } from '../services/dashboard';
import type { DashboardStats } from '../types/dashboard';

// Hook para obtener y refrescar las estadísticas del dashboard
export function useDashboard() {
  // Estado de las estadísticas
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Obtiene las estadísticas al montar el componente
  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  // Refresca las estadísticas
  const refreshStats = useCallback(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  return { stats, refreshStats };
}
