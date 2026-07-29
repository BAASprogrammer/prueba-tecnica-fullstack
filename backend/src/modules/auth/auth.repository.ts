import { prisma } from '../../shared/prisma';

// Buscar usuario por correo
export const findByEmail = (email: string) =>
  prisma.usuarios.findUnique({ where: { email } });

// Buscar usuario por ID
export const findById = (id: number) =>
  prisma.usuarios.findUnique({
    where: { id },
    select: { id: true, email: true, nombre: true, rol: true },
  });

// Crear usuario
export const create = (data: { email: string; password: string; nombre: string }) =>
  prisma.usuarios.create({ data });
