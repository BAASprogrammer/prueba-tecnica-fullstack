import { prisma } from '../../shared/prisma';
import type { RequestRow } from '../../types/request';
import { mapRequestRow } from '../../types/request';

// Obtiene todas las solicitudes de forma paginada
export const findAllPaginated = async (page: number, pageSize: number) => {
  // Obtiene todas las solicitudes de forma paginada
  const [data, countResult] = await Promise.all([
    // Consulta SQL para obtener todas las solicitudes de forma paginada
    prisma.$queryRaw<RequestRow[]>`
      SELECT s.id, s.numero, s.fecha, s.tipo, s.descripcion, s.estado, s."clienteId",
             c.id AS cliente_id, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono
      FROM "Solicitudes" s
      JOIN "Clientes" c ON c.id = s."clienteId"
      ORDER BY s.fecha DESC
      OFFSET ${(page - 1) * pageSize}
      LIMIT ${pageSize}
    `,
    // Consulta SQL para obtener el número total de solicitudes
    prisma.$queryRaw<[{ total: bigint }]>`
      SELECT COUNT(*) AS total FROM "Solicitudes"
    `,
  ]);
  // Retorna todas las solicitudes de forma paginada
  return { data: data.map(mapRequestRow), total: Number(countResult[0].total) };
};

// Buscar solicitud por ID
export const findById = async (id: number) => {
  // Consulta SQL para buscar solicitud por ID
  const rows = await prisma.$queryRaw<RequestRow[]>`
    SELECT s.id, s.numero, s.fecha, s.tipo, s.descripcion, s.estado, s."clienteId",
           c.id AS cliente_id, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono
    FROM "Solicitudes" s
    JOIN "Clientes" c ON c.id = s."clienteId"
    WHERE s.id = ${id}
  `;
  const row = rows[0];
  return row ? mapRequestRow(row) : null;
};

// Actualiza el estado de una solicitud
export const updateStatus = async (id: number, data: { estado: string }) => {
  // Actualiza el estado de una solicitud
  const rows = await prisma.$queryRaw<RequestRow[]>`
    UPDATE "Solicitudes" s
    SET estado = ${data.estado}::"EstadoSolicitud", "updatedAt" = NOW()
    FROM "Clientes" c
    WHERE s.id = ${id} AND c.id = s."clienteId"
    RETURNING s.id, s.numero, s.fecha, s.tipo, s.descripcion, s.estado, s."clienteId",
              c.id AS cliente_id, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono
  `;
  const row = rows[0];
  return row ? mapRequestRow(row) : null;
};

// Elimina una solicitud
export const remove = async (id: number) => {
  // Elimina una solicitud
  await prisma.$executeRaw`
    DELETE FROM "Solicitudes" WHERE id = ${id}
  `;
};