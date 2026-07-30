import { AppError, NotFoundError, ValidationError } from '../shared/errors';

describe('AppError', () => {
  it('crea error con mensaje y status por defecto 400', () => {
    const err = new AppError('Algo salió mal');
    expect(err.message).toBe('Algo salió mal');
    expect(err.statusCode).toBe(400);
    expect(err.name).toBe('AppError');
  });

  it('crea error con status personalizado', () => {
    const err = new AppError('No autorizado', 401);
    expect(err.statusCode).toBe(401);
  });
});

describe('NotFoundError', () => {
  it('tiene status 404 y mensaje por defecto', () => {
    const err = new NotFoundError();
    expect(err.message).toBe('Recurso no encontrado');
    expect(err.statusCode).toBe(404);
    expect(err.name).toBe('NotFoundError');
    expect(err).toBeInstanceOf(AppError);
  });

  it('acepta mensaje personalizado', () => {
    const err = new NotFoundError('Solicitud no encontrada');
    expect(err.message).toBe('Solicitud no encontrada');
  });
});

describe('ValidationError', () => {
  it('tiene status 422 y mensaje requerido', () => {
    const err = new ValidationError('Email inválido');
    expect(err.message).toBe('Email inválido');
    expect(err.statusCode).toBe(422);
    expect(err.name).toBe('ValidationError');
    expect(err).toBeInstanceOf(AppError);
  });
});
