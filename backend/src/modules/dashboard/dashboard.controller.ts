import { Request, Response } from 'express';
import { prisma } from '../../shared/prisma';
// Obtiene las estadísticas del dashboard
export const getStats = async (_req: Request, res: Response) => {
  try {
    // Consulta SQL para obtener estadísticas del dashboard
    const rows = await prisma.$queryRaw<[{ total: bigint; pending: bigint; completed: bigint; in_progress: bigint }]>`
      SELECT
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE')::bigint AS pending,
        COUNT(*) FILTER (WHERE estado = 'FINALIZADA')::bigint AS completed,
        COUNT(*) FILTER (WHERE estado = 'EN_PROCESO')::bigint AS in_progress
      FROM "Solicitudes"
    `;
    const stats = rows[0];
    res.json({
      total: Number(stats.total),
      pending: Number(stats.pending),
      completed: Number(stats.completed),
      inProgress: Number(stats.in_progress),
    });
  } catch {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
