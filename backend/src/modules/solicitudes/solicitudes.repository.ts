import { prisma } from '../../shared/prisma';

// Incluir el cliente en la consulta y ordenar por fecha
const include = { cliente: { select: { id: true, nombre: true, email: true, telefono: true } } };
const orderBy = { fecha: 'desc' as const };

// Encontrar todas las solicitudes de forma paginada
export const findAllPaginated = (page: number, pageSize: number) =>
  Promise.all([
    prisma.solicitudes.findMany({ orderBy, include, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.solicitudes.count(),
  ]).then(([data, total]) => ({ data, total }));
