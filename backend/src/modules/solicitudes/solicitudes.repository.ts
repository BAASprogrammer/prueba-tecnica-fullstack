import { EstadoSolicitud } from '@prisma/client';
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

// Encontrar una solicitud por ID
export const findById = (id: number) =>
  prisma.solicitudes.findUnique({ where: { id }, include: { cliente: true } });

// Actualizar el estado de una solicitud
export const updateStatus = (id: number, data: { estado: EstadoSolicitud }) =>
  prisma.solicitudes.update({ where: { id }, data, include: { cliente: true } });