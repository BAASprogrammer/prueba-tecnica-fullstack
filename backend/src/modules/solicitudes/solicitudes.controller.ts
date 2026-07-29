import { Request, Response } from 'express';
import * as solicitudesService from './solicitudes.service';

// Obtener todas las solicitudes de forma paginada con filtros y ordenamiento
export const getAll = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 10));
    // Parámetros de búsqueda, filtro y ordenamiento
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';
    const orderBy = (req.query.orderBy as string) || 'desc';
    // Llama al servicio con los filtros
    const result = await solicitudesService.getAllPaginated(page, pageSize, { search, status, orderBy });
    // Retorna el resultado
    res.json(result);
  } catch (error) {
    // Retorna estado 500: Internal Server Error
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

// Eliminar una solicitud
export const remove = async (req: Request, res: Response) => {
  try {
    // Convierte el ID a número
    const id = Number(req.params.id);
    // Llama al servicio para eliminar la solicitud
    await solicitudesService.remove(id);
    // Retorna estado 204: No Content, lo que significa que la solicitud se eliminó correctamente.
    res.status(204).end();
  } catch (error) {
    // Retorna estado 500: Internal Server Error, lo que significa que hubo un error al eliminar la solicitud.
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
};

// Actualizar el estado de una solicitud
export const updateStatus = async (req: Request, res: Response) => {
  try {
    // Convierte el ID a número
    const id = Number(req.params.id as string);
    const { estado } = req.body;
    // Llama al servicio para actualizar el estado
    const result = await solicitudesService.updateStatus(id, { estado });
    // Retorna el estado 200: OK, lo que significa que la solicitud se actualizó correctamente.
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};
