import { Request, Response } from 'express';
import * as solicitudesService from './solicitudes.service';

// Obtener todas las solicitudes de forma paginada
export const getAll = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 10));
    const result = await solicitudesService.getAllPaginated(page, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

// Actualizar el estado de una solicitud
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id as string);
    const { estado } = req.body;
    const result = await solicitudesService.updateStatus(id, { estado });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};
