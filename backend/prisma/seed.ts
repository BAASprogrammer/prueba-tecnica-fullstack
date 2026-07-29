import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña del usuario administrador
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.usuarios.upsert({
    where: { email: 'admin@correo.cl' },
    update: { password: hashedPassword, rol: 'admin', activo: true },
    create: { email: 'admin@correo.cl', password: hashedPassword, nombre: 'Admin', rol: 'admin', activo: true },
  });

  // Crear clientes iniciales
  const rodrigo = await prisma.clientes.upsert({
    where: { email: 'rodrigo.alarcon@correo.cl' },
    update: {},
    create: { nombre: 'Rodrigo Alarcón', email: 'rodrigo.alarcon@correo.cl', telefono: '+56911122233' },
  });
  const fernanda = await prisma.clientes.upsert({
    where: { email: 'fernanda.espinoza@mail.com' },
    update: {},
    create: { nombre: 'Fernanda Espinoza', email: 'fernanda.espinoza@mail.com', telefono: '+56922233344' },
  });
  const ignacio = await prisma.clientes.upsert({
    where: { email: 'ignacio.bravo@empresa.cl' },
    update: {},
    create: { nombre: 'Ignacio Bravo', email: 'ignacio.bravo@empresa.cl', telefono: '+56933344455' },
  });
  const josefa = await prisma.clientes.upsert({
    where: { email: 'josefa.reyes@gmail.com' },
    update: {},
    create: { nombre: 'Josefa Reyes', email: 'josefa.reyes@gmail.com', telefono: '+56944455566' },
  });
  const sebastian = await prisma.clientes.upsert({
    where: { email: 'sebastian.contreras@outlook.com' },
    update: {},
    create: { nombre: 'Sebastián Contreras', email: 'sebastian.contreras@outlook.com', telefono: '+56955566677' },
  });
  const antonia = await prisma.clientes.upsert({
    where: { email: 'antonia.sepulveda@hotmail.com' },
    update: {},
    create: { nombre: 'Antonia Sepúlveda', email: 'antonia.sepulveda@hotmail.com', telefono: '+56966677788' },
  });

  // Crear solicitudes iniciales
  const solicitudes = [
    { numero: 'REQ-2026-001', tipo: 'Reclamo por servicio', descripcion: 'El técnico no llegó en el horario acordado y no hubo aviso previo', estado: 'PENDIENTE' as const, clienteId: rodrigo.id },
    { numero: 'REQ-2026-002', tipo: 'Consulta de contrato', descripcion: 'Necesita copia del contrato firmado el año pasado', estado: 'FINALIZADA' as const, clienteId: fernanda.id },
    { numero: 'REQ-2026-003', tipo: 'Solicitud de upgrade', descripcion: 'Quiere aumentar la velocidad de su plan actual', estado: 'EN_PROCESO' as const, clienteId: ignacio.id },
    { numero: 'REQ-2026-004', tipo: 'Reclamo por servicio', descripcion: 'Corte de servicio recurrente en horario de la tarde', estado: 'PENDIENTE' as const, clienteId: josefa.id },
    { numero: 'REQ-2026-005', tipo: 'Cambio de titular', descripcion: 'Solicita transferir el servicio a nombre de un familiar', estado: 'EN_PROCESO' as const, clienteId: sebastian.id },
    { numero: 'REQ-2026-006', tipo: 'Consulta de contrato', descripcion: 'Duda sobre cláusula de renovación automática', estado: 'RECHAZADA' as const, clienteId: antonia.id },
    { numero: 'REQ-2026-007', tipo: 'Reclamo por servicio', descripcion: 'Equipo entregado con daños visibles en la carcasa', estado: 'PENDIENTE' as const, clienteId: rodrigo.id },
    { numero: 'REQ-2026-008', tipo: 'Solicitud de upgrade', descripcion: 'Interesado en agregar línea adicional al plan familiar', estado: 'FINALIZADA' as const, clienteId: fernanda.id },
    { numero: 'REQ-2026-009', tipo: 'Cambio de titular', descripcion: 'Cambio de domicilio con mantención del mismo número', estado: 'EN_PROCESO' as const, clienteId: ignacio.id },
    { numero: 'REQ-2026-010', tipo: 'Reclamo por servicio', descripcion: 'Factura llegó con un monto distinto al plan contratado', estado: 'PENDIENTE' as const, clienteId: josefa.id },
    { numero: 'REQ-2026-011', tipo: 'Consulta de contrato', descripcion: 'Solicita información sobre penalidad por término anticipado', estado: 'RECHAZADA' as const, clienteId: sebastian.id },
    { numero: 'REQ-2026-012', tipo: 'Solicitud de upgrade', descripcion: 'Quiere sumar servicio de streaming al plan actual', estado: 'FINALIZADA' as const, clienteId: antonia.id },
  ];
  // Crear solicitudes iniciales en la base de datos
  for (const s of solicitudes) {
    await prisma.solicitudes.upsert({
      where: { numero: s.numero },
      update: {},
      create: s,
    });
  }

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
