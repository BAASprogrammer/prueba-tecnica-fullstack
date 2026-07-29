import { Request, Response } from 'express';
import * as solicitudesService from './solicitudes.service';
// Obtener todas las solicitudes
export const getAll = async (_req: Request, res: Response) => {
  try {
    const solicitudes = await solicitudesService.getAll();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};
