import { Request, Response } from 'express';
import { prisma } from '../../shared/prisma';
import { searchExternalAPI } from './clientes.service';

// Obtener todos los clientes ordenados por nombre
export const getAll = async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.$queryRaw<{ id: number; name: string; email: string; phone: string }[]>`
      SELECT id, nombre AS name, email, telefono AS phone FROM "Clientes" ORDER BY nombre ASC
    `;
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Autocompletar datos de cliente desde API externa por RUT o email
export const autocomplete = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'Debe ingresar un RUT o email' });
    return;
  }

  const q = query.trim();

  // ---- 1. Buscar en base de datos local primero ----
  try {
    const local = await prisma.$queryRaw<{ id: number; name: string; email: string; phone: string }[]>`
      SELECT id, nombre AS name, email, telefono AS phone FROM "Clientes"
      WHERE email = ${q} OR telefono = ${q}
      LIMIT 1
    `;
    if (local[0]) {
      res.json({ source: 'local', ...local[0] });
      return;
    }
  } catch {
    // Si falla la BD, continúa con API externa
  }

  // ---- 2. Consumir API externa simulada con timeout ----
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // timeout de 5s

  try {
    const external = await searchExternalAPI(q, controller.signal);
    clearTimeout(timeout);
    res.json({ source: 'external', ...external });
  } catch (err: any) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      res.status(504).json({ error: 'La consulta a API externa excedió el tiempo de espera' });
      return;
    }

    if (err.status === 404) {
      res.status(404).json({ error: err.message });
      return;
    }

    res.status(502).json({ error: 'Error al consultar API externa' });
  }
};
