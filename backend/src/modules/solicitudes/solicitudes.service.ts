import { EstadoSolicitud } from '@prisma/client';
import { prisma } from '../../shared/prisma';
import * as solicitudesRepository from './solicitudes.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';

// Obtener todas las solicitudes de forma paginada con filtros y ordenamiento
// Obtener una solicitud por ID
export const getById = async (id: number) => {
  return solicitudesRepository.findById(id);
};

export const getAllPaginated = async (
  page: number,
  pageSize: number,
  filters: { search?: string; status?: string; orderBy?: string }
) => {
  // Obtiene las solicitudes con los filtros aplicados
  const { data, total } = await solicitudesRepository.findAllPaginated(page, pageSize, filters);
  // Retorna todas las solicitudes de forma paginada
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};

// Eliminar una solicitud
export const remove = async (id: number) => {
  // Buscar solicitud
  const solicitud = await solicitudesRepository.findById(id);
  // Si no se encuentra la solicitud, lanzar error
  if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
  // Eliminar solicitud
  await solicitudesRepository.remove(id);
};

// Actualizar una solicitud (campos opcionales)
export const update = async (id: number, data: {
  numero?: string; fecha?: string; tipo?: string; descripcion?: string; estado?: string; clienteId?: number;
  nombre?: string; email?: string; telefono?: string;
}) => {
  // Buscar solicitud
  const solicitud = await solicitudesRepository.findById(id);
  if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

  // Validar estado si viene
  if (data.estado) {
    const validStates = Object.values(EstadoSolicitud);
    if (!validStates.includes(data.estado as EstadoSolicitud)) {
      throw new ValidationError('Estado inválido');
    }
  }

  // Validar cliente si viene
  if (data.clienteId) {
    const clienteRows = await prisma.$queryRaw<[{ id: number }]>`
      SELECT id FROM "Clientes" WHERE id = ${data.clienteId}
    `;
    if (!clienteRows[0]) throw new NotFoundError('Cliente no encontrado');
  }

  // Actualizar datos del cliente si se enviaron
  if (data.nombre !== undefined || data.email !== undefined || data.telefono !== undefined) {
    const setClauses: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (data.nombre !== undefined) { setClauses.push(`nombre = $${idx}`); params.push(data.nombre); idx++; }
    if (data.email !== undefined) { setClauses.push(`email = $${idx}`); params.push(data.email); idx++; }
    if (data.telefono !== undefined) { setClauses.push(`telefono = $${idx}`); params.push(data.telefono); idx++; }
    setClauses.push(`"updatedAt" = NOW()`);
    params.push(solicitud.clientId);
    await prisma.$executeRawUnsafe(`
      UPDATE "Clientes" SET ${setClauses.join(', ')} WHERE id = $${idx}
    `, ...params);
  }

  // Preparar datos para el repositorio (convertir fecha si viene)
  const repoData: any = { ...data };
  delete repoData.nombre;
  delete repoData.email;
  delete repoData.telefono;
  if (repoData.fecha) repoData.fecha = new Date(repoData.fecha);

  const result = await solicitudesRepository.update(id, repoData);
  return result;
};

// Actualizar estado de una solicitud
export const updateStatus = async (id: number, data: { estado: string }) => {
  const solicitud = await solicitudesRepository.findById(id);
  if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

  const validStates = Object.values(EstadoSolicitud);
  if (!validStates.includes(data.estado as EstadoSolicitud)) {
    throw new ValidationError('Estado inválido');
  }

  const result = await solicitudesRepository.updateStatus(id, data as { estado: string });
  return result;
};


