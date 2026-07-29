import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña del usuario administrador
  const hashedPassword = await bcrypt.hash('123456', 10);
  // Insertar usuario administrador
  await prisma.$executeRaw`
    INSERT INTO "Usuarios" (email, password, nombre, rol, activo, "createdAt", "updatedAt")
    VALUES ('admin@correo.cl', ${hashedPassword}, 'Admin', 'admin', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET password = ${hashedPassword}, rol = 'admin', activo = true, "updatedAt" = NOW()
  `;

  // Crear clientes iniciales
  const clientes = [
    { nombre: 'Rodrigo Alarcón', email: 'rodrigo.alarcon@correo.cl', telefono: '+56911122233' },
    { nombre: 'Fernanda Espinoza', email: 'fernanda.espinoza@mail.com', telefono: '+56922233344' },
    { nombre: 'Ignacio Bravo', email: 'ignacio.bravo@empresa.cl', telefono: '+56933344455' },
    { nombre: 'Josefa Reyes', email: 'josefa.reyes@gmail.com', telefono: '+56944455566' },
    { nombre: 'Sebastián Contreras', email: 'sebastian.contreras@outlook.com', telefono: '+56955566677' },
    { nombre: 'Antonia Sepúlveda', email: 'antonia.sepulveda@hotmail.com', telefono: '+56966677788' },
  ];

  const clientIds: number[] = [];
  // Crear clientes iniciales
  for (const c of clientes) {
    const rows = await prisma.$queryRaw<[{ id: number }]>`
      INSERT INTO "Clientes" (nombre, email, telefono, "createdAt", "updatedAt")
      VALUES (${c.nombre}, ${c.email}, ${c.telefono}, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET nombre = ${c.nombre}, telefono = ${c.telefono}, "updatedAt" = NOW()
      RETURNING id
    `;
    clientIds.push(rows[0].id);
  }

  // Crear solicitudes iniciales
  const solicitudes = [
    { numero: 'REQ-2026-001', fecha: '2026-01-10', tipo: 'Reclamo por servicio', descripcion: 'El técnico no llegó en el horario acordado y no hubo aviso previo', estado: 'PENDIENTE', clienteIdx: 0 },
    { numero: 'REQ-2026-002', fecha: '2026-02-14', tipo: 'Consulta de contrato', descripcion: 'Necesita copia del contrato firmado el año pasado', estado: 'FINALIZADA', clienteIdx: 1 },
    { numero: 'REQ-2026-003', fecha: '2026-03-05', tipo: 'Solicitud de upgrade', descripcion: 'Quiere aumentar la velocidad de su plan actual', estado: 'EN_PROCESO', clienteIdx: 2 },
    { numero: 'REQ-2026-004', fecha: '2026-03-20', tipo: 'Reclamo por servicio', descripcion: 'Corte de servicio recurrente en horario de la tarde', estado: 'PENDIENTE', clienteIdx: 3 },
    { numero: 'REQ-2026-005', fecha: '2026-04-02', tipo: 'Cambio de titular', descripcion: 'Solicita transferir el servicio a nombre de un familiar', estado: 'EN_PROCESO', clienteIdx: 4 },
    { numero: 'REQ-2026-006', fecha: '2026-04-18', tipo: 'Consulta de contrato', descripcion: 'Duda sobre cláusula de renovación automática', estado: 'RECHAZADA', clienteIdx: 5 },
    { numero: 'REQ-2026-007', fecha: '2026-05-11', tipo: 'Reclamo por servicio', descripcion: 'Equipo entregado con daños visibles en la carcasa', estado: 'PENDIENTE', clienteIdx: 0 },
    { numero: 'REQ-2026-008', fecha: '2026-05-30', tipo: 'Solicitud de upgrade', descripcion: 'Interesado en agregar línea adicional al plan familiar', estado: 'FINALIZADA', clienteIdx: 1 },
    { numero: 'REQ-2026-009', fecha: '2026-06-15', tipo: 'Cambio de titular', descripcion: 'Cambio de domicilio con mantención del mismo número', estado: 'EN_PROCESO', clienteIdx: 2 },
    { numero: 'REQ-2026-010', fecha: '2026-07-01', tipo: 'Reclamo por servicio', descripcion: 'Factura llegó con un monto distinto al plan contratado', estado: 'PENDIENTE', clienteIdx: 3 },
    { numero: 'REQ-2026-011', fecha: '2026-07-14', tipo: 'Consulta de contrato', descripcion: 'Solicita información sobre penalidad por término anticipado', estado: 'RECHAZADA', clienteIdx: 4 },
    { numero: 'REQ-2026-012', fecha: '2026-07-28', tipo: 'Solicitud de upgrade', descripcion: 'Quiere sumar servicio de streaming al plan actual', estado: 'FINALIZADA', clienteIdx: 5 },
  ];

  // Crear solicitudes iniciales en la base de datos
  for (const s of solicitudes) {
    await prisma.$executeRaw`
      INSERT INTO "Solicitudes" (numero, fecha, tipo, descripcion, estado, "clienteId", "createdAt", "updatedAt")
      VALUES (${s.numero}, ${new Date(s.fecha)}, ${s.tipo}, ${s.descripcion}, ${s.estado}::"EstadoSolicitud", ${clientIds[s.clienteIdx]}, NOW(), NOW())
      ON CONFLICT (numero) DO UPDATE SET
        fecha = ${new Date(s.fecha)},
        tipo = ${s.tipo},
        descripcion = ${s.descripcion},
        estado = ${s.estado}::"EstadoSolicitud",
        "clienteId" = ${clientIds[s.clienteIdx]},
        "updatedAt" = NOW()
    `;
  }

  // Mostrar mensaje de completado
  console.log('Seed completado: 1 usuario, 6 clientes, 12 solicitudes.');
}

// Ejecutar seed
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
