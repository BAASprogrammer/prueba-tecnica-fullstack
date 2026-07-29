// Estadísticas del dashboard
export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  inProgress: number;
}
// Props del componente Dashboard
export interface Props {
  stats: DashboardStats;
}
