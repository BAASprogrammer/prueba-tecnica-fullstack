import { prisma } from '../../shared/prisma';
import type { User } from '@prisma/client';

type PublicUser = Pick<User, 'id' | 'email' | 'nombre' | 'rol'>;
// Buscar usuario por email
export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });
// Buscar usuario por id
export const findById = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, nombre: true, rol: true },
  });
// Crear usuario
export const create = (data: { email: string; password: string; nombre: string }) =>
  prisma.user.create({ data });
