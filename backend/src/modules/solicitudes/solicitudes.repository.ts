import { prisma } from '../../shared/prisma';

// Obtener todas las solicitudes
export const findAll = () =>
  prisma.solicitudes.findMany({
    orderBy: { fecha: 'desc' },
    include: { cliente: { select: { id: true, nombre: true, email: true, telefono: true } } },
  });
