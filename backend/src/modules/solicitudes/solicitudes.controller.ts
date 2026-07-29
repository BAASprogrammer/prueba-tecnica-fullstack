import { Request, Response } from 'express';
import * as solicitudesService from './solicitudes.service';

// Obtener todas las solicitudes de forma paginada
export const getAll = async (req: Request, res: Response) => {
  try {
    // Convierte la página a número
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    // Convierte el tamaño de la página a número
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 10));
    // Llama al servicio para obtener las solicitudes
    const result = await solicitudesService.getAllPaginated(page, pageSize);
    // Retorna el estado 200: OK, lo que significa que las solicitudes se obtuvieron correctamente.
    res.json(result);
  } catch (error) {
    // Retorna estado 500: Internal Server Error, lo que significa que hubo un error al obtener las solicitudes.
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
