-- AlterTable Usuarios: add activo column, change rol default
ALTER TABLE "Usuarios" ADD COLUMN IF NOT EXISTS "activo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Usuarios" ALTER COLUMN "rol" SET DEFAULT 'admin';
