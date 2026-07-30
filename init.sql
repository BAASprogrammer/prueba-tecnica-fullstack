-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'FINALIZADA', 'RECHAZADA');

-- CreateTable Usuarios
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable Clientes
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable Solicitudes
CREATE TABLE "Solicitudes" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "Solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");
CREATE INDEX "Usuarios_email_idx" ON "Usuarios"("email");
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");
CREATE INDEX "Clientes_email_idx" ON "Clientes"("email");
CREATE UNIQUE INDEX "Solicitudes_numero_key" ON "Solicitudes"("numero");
CREATE INDEX "Solicitudes_estado_idx" ON "Solicitudes"("estado");
CREATE INDEX "Solicitudes_fecha_idx" ON "Solicitudes"("fecha");
CREATE INDEX "Solicitudes_clienteId_idx" ON "Solicitudes"("clienteId");

-- AddForeignKey
ALTER TABLE "Solicitudes" ADD CONSTRAINT "Solicitudes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed Usuarios
INSERT INTO public."Usuarios" (id, email, password, nombre, rol, activo, "createdAt", "updatedAt")
VALUES (1, 'admin@correo.cl', '$2b$10$.rP/v9GrSIwVCLaRSCCtIO1Vchs0OZ2GYlsrOnqrmv/ZkpzrIhIGK', 'Admin', 'admin', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, nombre = EXCLUDED.nombre, rol = EXCLUDED.rol, activo = EXCLUDED.activo, "updatedAt" = NOW();

-- Seed Clientes
INSERT INTO public."Clientes" (id, nombre, email, telefono, "createdAt", "updatedAt")
VALUES
(1, 'Rodrigo Alarcón', 'rodrigo.alarcon@correo.cl', '+56911122233', NOW(), NOW()),
(2, 'Fernanda Espinoza', 'fernanda.espinoza@mail.com', '+56922233344', NOW(), NOW()),
(3, 'Ignacio Bravo', 'ignacio.bravo@empresa.cl', '+56933344455', NOW(), NOW()),
(4, 'Josefa Reyes', 'josefa.reyes@gmail.com', '+56944455566', NOW(), NOW()),
(5, 'Sebastián Contreras', 'sebastian.contreras@outlook.com', '+56955566677', NOW(), NOW()),
(6, 'Antonia Sepúlveda', 'antonia.sepulveda@hotmail.com', '+56966677788', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre, telefono = EXCLUDED.telefono, "updatedAt" = NOW();

-- Seed Solicitudes
INSERT INTO public."Solicitudes" (id, numero, fecha, tipo, descripcion, estado, "clienteId", "createdAt", "updatedAt")
VALUES
(1, 'REQ-2026-001', NOW(), 'Reclamo por servicio', 'El técnico no llegó en el horario acordado y no hubo aviso previo', 'PENDIENTE', 1, NOW(), NOW()),
(2, 'REQ-2026-002', NOW(), 'Consulta de contrato', 'Necesita copia del contrato firmado el año pasado', 'FINALIZADA', 2, NOW(), NOW()),
(3, 'REQ-2026-003', NOW(), 'Solicitud de upgrade', 'Quiere aumentar la velocidad de su plan actual', 'EN_PROCESO', 3, NOW(), NOW()),
(4, 'REQ-2026-004', NOW(), 'Reclamo por servicio', 'Corte de servicio recurrente en horario de la tarde', 'PENDIENTE', 4, NOW(), NOW()),
(5, 'REQ-2026-005', NOW(), 'Cambio de titular', 'Solicita transferir el servicio a nombre de un familiar', 'EN_PROCESO', 5, NOW(), NOW()),
(6, 'REQ-2026-006', NOW(), 'Consulta de contrato', 'Duda sobre cláusula de renovación automática', 'RECHAZADA', 6, NOW(), NOW()),
(7, 'REQ-2026-007', NOW(), 'Reclamo por servicio', 'Equipo entregado con daños visibles en la carcasa', 'PENDIENTE', 1, NOW(), NOW()),
(8, 'REQ-2026-008', NOW(), 'Solicitud de upgrade', 'Interesado en agregar línea adicional al plan familiar', 'FINALIZADA', 2, NOW(), NOW()),
(9, 'REQ-2026-009', NOW(), 'Cambio de titular', 'Cambio de domicilio con mantención del mismo número', 'EN_PROCESO', 3, NOW(), NOW()),
(10, 'REQ-2026-010', NOW(), 'Reclamo por servicio', 'Factura llegó con un monto distinto al plan contratado', 'PENDIENTE', 4, NOW(), NOW()),
(11, 'REQ-2026-011', NOW(), 'Consulta de contrato', 'Solicita información sobre penalidad por término anticipado', 'RECHAZADA', 5, NOW(), NOW()),
(12, 'REQ-2026-012', NOW(), 'Solicitud de upgrade', 'Quiere sumar servicio de streaming al plan actual', 'FINALIZADA', 6, NOW(), NOW())
ON CONFLICT (numero) DO UPDATE SET fecha = EXCLUDED.fecha, tipo = EXCLUDED.tipo, descripcion = EXCLUDED.descripcion, estado = EXCLUDED.estado, "clienteId" = EXCLUDED."clienteId", "updatedAt" = NOW();

-- Set sequence values
SELECT pg_catalog.setval('public."Usuarios_id_seq"', 1, true);
SELECT pg_catalog.setval('public."Clientes_id_seq"', 6, true);
SELECT pg_catalog.setval('public."Solicitudes_id_seq"', 12, true);
