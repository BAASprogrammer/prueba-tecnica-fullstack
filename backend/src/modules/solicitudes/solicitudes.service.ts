import * as solicitudesRepository from './solicitudes.repository';

// Obtener todas las solicitudes
export const getAll = async () => {
  const solicitudes = await solicitudesRepository.findAll();
  return solicitudes;
};
