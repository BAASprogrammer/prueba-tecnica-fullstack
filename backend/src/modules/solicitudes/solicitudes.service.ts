import * as solicitudesRepository from './solicitudes.repository';

// Obtener todas las solicitudes de forma paginada
export const getAllPaginated = async (page: number, pageSize: number) => {
  const { data, total } = await solicitudesRepository.findAllPaginated(page, pageSize);
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};
