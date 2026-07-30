import { prisma } from '../../shared/prisma';
import type { UserRow, UserPublic } from '../../types/user';

// Buscar usuario por correo
export const findByEmail = async (email: string) => {
  // Consulta SQL para buscar usuario por correo
  const rows = await prisma.$queryRaw<UserRow[]>`
    SELECT id, email, password, nombre AS name, rol AS role, activo AS active, "createdAt", "updatedAt"
    FROM "Usuarios" WHERE email = ${email}
  `;
  return rows[0] ?? null;
};

// Buscar usuario por ID
export const findById = async (id: number) => {
  // Consulta SQL para buscar usuario por ID
  const rows = await prisma.$queryRaw<UserPublic[]>`
    SELECT id, email, nombre AS name, rol AS role FROM "Usuarios" WHERE id = ${id}
  `;
  return rows[0] ?? null;
};

// Crear usuario
export const create = async (data: { email: string; password: string; nombre: string }) => {
  // Consulta SQL para crear usuario
  const rows = await prisma.$queryRaw<UserRow[]>`
    INSERT INTO "Usuarios" (email, password, nombre, "updatedAt")
    VALUES (${data.email}, ${data.password}, ${data.nombre}, now())
    RETURNING id, email, password, nombre AS name, rol AS role, activo AS active, "createdAt", "updatedAt"
  `;
  return rows[0]!;
};