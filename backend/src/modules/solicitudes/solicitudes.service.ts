import { EstadoSolicitud } from '@prisma/client';
import * as solicitudesRepository from './solicitudes.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';

// Obtener todas las solicitudes de forma paginada con filtros y ordenamiento
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

// Actualizar estado de una solicitud
export const updateStatus = async (id: number, data: { estado: string }) => {
  // Validar que el estado sea valido
  const validStates = Object.values(EstadoSolicitud);
  if (!validStates.includes(data.estado as EstadoSolicitud)) {
    throw new ValidationError('Estado inválido');
  }
  // Buscar solicitud
  const solicitud = await solicitudesRepository.findById(id);
  // Si no se encuentra la solicitud, lanzar error
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }
  // Actualizar solicitud
  const result = await solicitudesRepository.updateStatus(id, data as { estado: EstadoSolicitud });
  return result;
};
