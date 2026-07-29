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

// Actualizar una solicitud
export const update = async (req: Request, res: Response) => {
  try {
    // Convierte el ID a número
    const id = Number(req.params.id);
    // Extrae los campos del cuerpo de la solicitud
    const { numero, fecha, tipo, descripcion, estado, clienteId, nombre, email, telefono } = req.body;
    // Llama al servicio para actualizar la solicitud
    const result = await solicitudesService.update(id, { numero, fecha, tipo, descripcion, estado, clienteId, nombre, email, telefono });
    // Retorna el resultado
    res.json(result);
  } catch (error) {
    // Retorna estado 500: Internal Server Error
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};

// Obtener una solicitud por ID
export const getById = async (req: Request, res: Response) => {
  try {
    // Convierte el ID a número
    const id = Number(req.params.id);
    // Llama al servicio para obtener la solicitud
    const result = await solicitudesService.getById(id);
    // Si la solicitud no existe, retorna estado 404: Not Found
    if (!result) {
      res.status(404).json({ error: 'Solicitud no encontrada' });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
};
