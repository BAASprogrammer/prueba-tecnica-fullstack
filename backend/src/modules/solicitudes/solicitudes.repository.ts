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

// Crear una solicitud
export const create = async (data: {
  numero: string; fecha: Date; tipo: string; descripcion: string; estado: string; clienteId: number;
}) => {
  // Inserta la solicitud y obtiene el ID generado
  const result = await prisma.$queryRaw<[{ id: number }]>`
    INSERT INTO "Solicitudes" (numero, fecha, tipo, descripcion, estado, "clienteId", "createdAt", "updatedAt")
    VALUES (${data.numero}, ${data.fecha}, ${data.tipo}, ${data.descripcion}, ${data.estado}::"EstadoSolicitud", ${data.clienteId}, NOW(), NOW())
    RETURNING id
  `;
  // Retorna la solicitud recién creada con los datos del cliente
  return findById(result[0].id);
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

// Actualiza los campos de una solicitud
export const update = async (
  id: number,
  data: { numero?: string; fecha?: Date; tipo?: string; descripcion?: string; estado?: string; clienteId?: number }
) => {
  // Construye dinámicamente los SET
  const setClauses: string[] = [];
  const params: any[] = [];
  let idx = 1;
  // Si se envía el número, se actualiza
  if (data.numero !== undefined) {
    setClauses.push(`numero = $${idx}`);
    params.push(data.numero);
    idx++;
  }
  // Si se envía la fecha, se actualiza
  if (data.fecha !== undefined) {
    setClauses.push(`fecha = $${idx}`);
    params.push(data.fecha);
    idx++;
  }
  // Si se envía el tipo, se actualiza
  if (data.tipo !== undefined) {
    setClauses.push(`tipo = $${idx}`);
    params.push(data.tipo);
    idx++;
  }
  // Si se envía la descripción, se actualiza
  if (data.descripcion !== undefined) {
    setClauses.push(`descripcion = $${idx}`);
    params.push(data.descripcion);
    idx++;
  }
  // Si se envía el estado, se actualiza
  if (data.estado !== undefined) {
    setClauses.push(`estado = $${idx}::"EstadoSolicitud"`);
    params.push(data.estado);
    idx++;
  }
  // Si se envía el cliente, se actualiza
  if (data.clienteId !== undefined) {
    setClauses.push(`"clienteId" = $${idx}`);
    params.push(data.clienteId);
    idx++;
  }

  // Siempre actualiza el timestamp
  setClauses.push(`"updatedAt" = NOW()`);

  // Si no hay campos que actualizar, retorna la solicitud actual
  if (setClauses.length === 1) {
    return findById(id);
  }

  // Agrega el ID al final de los parámetros
  params.push(id);

  // Ejecuta la actualización con RETURNING incluyendo el join a Clientes
  const sql = `
    UPDATE "Solicitudes" s
    SET ${setClauses.join(', ')}
    FROM "Clientes" c
    WHERE s.id = $${idx} AND c.id = s."clienteId"
    RETURNING s.id, s.numero, s.fecha, s.tipo, s.descripcion, s.estado, s."clienteId",
              c.id AS cliente_id, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono
  `;
  const rows = await prisma.$queryRawUnsafe<RequestRow[]>(sql, ...params);
  const row = rows[0];
  return row ? mapRequestRow(row) : null;
};

// Elimina una solicitud
export const remove = async (id: number) => {
  await prisma.$executeRaw`
    DELETE FROM "Solicitudes" WHERE id = ${id}
  `;
};