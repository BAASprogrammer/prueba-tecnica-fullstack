import { prisma } from '../../shared/prisma';
import type { RequestRow } from '../../types/request';
import { mapRequestRow } from '../../types/request';

// Obtiene todas las solicitudes de forma paginada con filtros y ordenamiento
export const findAllPaginated = async (
  page: number,
  pageSize: number,
  filters: { search?: string; status?: string; orderBy?: string }
) => {
  // Construye las condiciones WHERE dinámicamente
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  // Filtro por búsqueda en número, nombre del cliente o descripción
  if (filters.search) {
    conditions.push(`(s.numero ILIKE $${idx} OR c.nombre ILIKE $${idx} OR s.descripcion ILIKE $${idx})`);
    params.push(`%${filters.search}%`);
    idx++;
  }

  // Filtro por estado
  if (filters.status && filters.status !== 'ALL') {
    conditions.push(`s.estado = $${idx}::"EstadoSolicitud"`);
    params.push(filters.status);
    idx++;
  }

  // Cláusula WHERE
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  // Ordenamiento por fecha
  const order = filters.orderBy === 'asc' ? 'ASC' : 'DESC';

  // Consulta principal con filtros
  const selectSQL = `
    SELECT s.id, s.numero, s.fecha, s.tipo, s.descripcion, s.estado, s."clienteId",
           c.id AS cliente_id, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono
    FROM "Solicitudes" s
    JOIN "Clientes" c ON c.id = s."clienteId"
    ${where}
    ORDER BY s.fecha ${order}
    OFFSET ${(page - 1) * pageSize}
    LIMIT ${pageSize}
  `;

  // Consulta de conteo con los mismos filtros
  const countSQL = `
    SELECT COUNT(*) AS total
    FROM "Solicitudes" s
    JOIN "Clientes" c ON c.id = s."clienteId"
    ${where}
  `;

  // Ejecuta ambas consultas en paralelo
  const [data, countResult] = await Promise.all([
    prisma.$queryRawUnsafe<RequestRow[]>(selectSQL, ...params),
    prisma.$queryRawUnsafe<[{ total: bigint }]>(countSQL, ...params),
  ]);

  // Retorna los datos mapeados y el total
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