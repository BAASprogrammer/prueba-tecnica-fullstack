import { describe, it, expect } from 'vitest';
import { validateRequestForm } from '../hooks/useRequests';

describe('validateRequestForm', () => {
  const validValues = {
    clientName: 'Juan Pérez',
    clientEmail: 'juan@correo.cl',
    clientPhone: '+56912345678',
    date: '2026-08-15',
    type: 'Reclamo',
    description: 'Descripción de prueba',
  };

  it('retorna objeto vacío para datos válidos', () => {
    expect(validateRequestForm(validValues)).toEqual({});
  });

  it('requiere nombre del cliente', () => {
    const err = validateRequestForm({ ...validValues, clientName: '' });
    expect(err.clientName).toBeDefined();
  });

  it('requiere email', () => {
    const err = validateRequestForm({ ...validValues, clientEmail: '' });
    expect(err.clientEmail).toBeDefined();
  });

  it('valida formato de email', () => {
    const err = validateRequestForm({ ...validValues, clientEmail: 'invalido' });
    expect(err.clientEmail).toBe('Email inválido');
  });

  it('requiere teléfono', () => {
    const err = validateRequestForm({ ...validValues, clientPhone: '' });
    expect(err.clientPhone).toBeDefined();
  });

  it('valida formato +569XXXXXXXX', () => {
    const err = validateRequestForm({ ...validValues, clientPhone: '+5691234' });
    expect(err.clientPhone).toBe('Formato: +56912345678');
  });

  it('requiere fecha', () => {
    const err = validateRequestForm({ ...validValues, date: '' });
    expect(err.date).toBeDefined();
  });

  it('requiere tipo', () => {
    const err = validateRequestForm({ ...validValues, type: '' });
    expect(err.type).toBeDefined();
  });

  it('requiere descripción', () => {
    const err = validateRequestForm({ ...validValues, description: '' });
    expect(err.description).toBeDefined();
  });

  it('retorna múltiples errores simultáneamente', () => {
    const err = validateRequestForm({ ...validValues, clientName: '', clientEmail: '', clientPhone: '' });
    expect(Object.keys(err)).toHaveLength(3);
  });
});
