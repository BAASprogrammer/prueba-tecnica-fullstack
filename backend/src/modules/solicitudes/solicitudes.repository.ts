import { prisma } from '../../shared/prisma';

// Obtener todas las solicitudes
export const findAll = () =>
  prisma.solicitud.findMany({
    orderBy: { fecha: 'desc' },
    include: { cliente: { select: { id: true, nombre: true, email: true } } },
  });
