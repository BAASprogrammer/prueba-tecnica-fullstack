import { EstadoSolicitud } from '@prisma/client';
import * as solicitudesRepository from './solicitudes.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';

// Obtener todas las solicitudes de forma paginada
export const getAllPaginated = async (page: number, pageSize: number) => {
  const { data, total } = await solicitudesRepository.findAllPaginated(page, pageSize);
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
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
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }
  // Actualizar solicitud
  const result = await solicitudesRepository.updateStatus(id, data as { estado: EstadoSolicitud });
  return result;
};
