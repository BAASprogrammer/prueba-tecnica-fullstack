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

// Crear una solicitud
export const create = async (req: Request, res: Response) => {
  try {
    // Extrae los campos del cuerpo de la solicitud
    const { fecha, tipo, descripcion, estado, nombre, email, telefono } = req.body;

    // Validar fecha
    if (!fecha || isNaN(new Date(fecha).getTime())) {
      res.status(400).json({ error: 'La fecha es obligatoria y debe ser válida' });
      return;
    }
    // Validar tipo
    if (!tipo || !tipo.toString().trim()) {
      res.status(400).json({ error: 'El tipo de solicitud es obligatorio' });
      return;
    }
    // Validar descripción
    if (!descripcion || !descripcion.toString().trim()) {
      res.status(400).json({ error: 'La descripción es obligatoria' });
      return;
    }
    // Validar estado
    const validStates = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADA', 'RECHAZADA'];
    if (!estado || !validStates.includes(estado)) {
      res.status(400).json({ error: 'Estado inválido' });
      return;
    }
    // Validar nombre del cliente
    if (!nombre || !nombre.toString().trim()) {
      res.status(400).json({ error: 'El nombre del cliente es obligatorio' });
      return;
    }
    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }
    // Validar teléfono
    if (!telefono || !/^\+569\d{8}$/.test(telefono.toString())) {
      res.status(400).json({ error: 'El teléfono debe tener formato +56912345678' });
      return;
    }

    // Llama al servicio para crear la solicitud
    const result = await solicitudesService.create({ fecha, tipo, descripcion, estado, nombre, email, telefono });
    // Retorna el resultado con estado 201: Created
    res.status(201).json(result);
  } catch (error) {
    // Retorna estado 500: Internal Server Error
    res.status(500).json({ error: 'Error al crear solicitud' });
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

// Actualizar una solicitud (campos opcionales)
export const update = async (req: Request, res: Response) => {
  try {
    // Convierte el ID a número
    const id = Number(req.params.id);
    // Extrae los campos del cuerpo de la solicitud
    const { fecha, tipo, descripcion, estado, nombre, email, telefono } = req.body;

    // Validar fecha
    if (fecha !== undefined && isNaN(new Date(fecha).getTime())) {
      res.status(400).json({ error: 'Fecha inválida' });
      return;
    }
    // Validar tipo
    if (tipo !== undefined && !tipo.toString().trim()) {
      res.status(400).json({ error: 'El tipo de solicitud no puede estar vacío' });
      return;
    }
    // Validar descripción
    if (descripcion !== undefined && !descripcion.toString().trim()) {
      res.status(400).json({ error: 'La descripción no puede estar vacía' });
      return;
    }
    // Validar estado
    if (estado !== undefined) {
      const validStates = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADA', 'RECHAZADA'];
      if (!validStates.includes(estado)) {
        res.status(400).json({ error: 'Estado inválido' });
        return;
      }
    }
    // Validar nombre del cliente
    if (nombre !== undefined && !nombre.toString().trim()) {
      res.status(400).json({ error: 'El nombre del cliente no puede estar vacío' });
      return;
    }
    // Validar email
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }
    // Validar teléfono
    if (telefono !== undefined && !/^\+569\d{8}$/.test(telefono.toString())) {
      res.status(400).json({ error: 'El teléfono debe tener formato +56912345678' });
      return;
    }

    // Llama al servicio para actualizar la solicitud
    const result = await solicitudesService.update(id, { fecha, tipo, descripcion, estado, nombre, email, telefono });
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
