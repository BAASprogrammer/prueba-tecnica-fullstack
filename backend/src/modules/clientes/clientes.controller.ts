import { Request, Response } from 'express';
import { prisma } from '../../shared/prisma';

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
