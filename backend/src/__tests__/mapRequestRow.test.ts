import { mapRequestRow } from '../types/request';

describe('mapRequestRow', () => {
  const row = {
    id: 1,
    numero: 'REQ-2026-001',
    fecha: new Date('2026-01-10'),
    tipo: 'Reclamo por servicio',
    descripcion: 'El técnico no llegó',
    estado: 'PENDIENTE',
    clienteId: 1,
    cliente_id: 1,
    cliente_nombre: 'Rodrigo Alarcón',
    cliente_email: 'rodrigo@correo.cl',
    cliente_telefono: '+56911122333',
  };

  it('mapea columnas SQL a camelCase en inglés', () => {
    const result = mapRequestRow(row);
    expect(result.number).toBe('REQ-2026-001');
    expect(result.date).toEqual(new Date('2026-01-10'));
    expect(result.type).toBe('Reclamo por servicio');
    expect(result.description).toBe('El técnico no llegó');
    expect(result.status).toBe('PENDIENTE');
    expect(result.clientId).toBe(1);
  });

  it('mapea datos anidados del cliente', () => {
    const result = mapRequestRow(row);
    expect(result.client).toEqual({
      id: 1,
      name: 'Rodrigo Alarcón',
      email: 'rodrigo@correo.cl',
      phone: '+56911122333',
    });
  });
});
