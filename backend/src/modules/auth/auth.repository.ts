import { prisma } from '../../shared/prisma';

export const findByEmail = (email: string) =>
  prisma.usuarios.findUnique({ where: { email } });

export const findById = (id: number) =>
  prisma.usuarios.findUnique({
    where: { id },
    select: { id: true, email: true, nombre: true, rol: true },
  });

export const create = (data: { email: string; password: string; nombre: string }) =>
  prisma.usuarios.create({ data });
