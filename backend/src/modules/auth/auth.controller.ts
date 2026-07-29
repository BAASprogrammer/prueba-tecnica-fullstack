import { Request, Response } from 'express';
import * as authService from './auth.service';

// Función para registrar un usuario
export const register = async (req: Request, res: Response) => {
  try {
    // Extraer datos del body
    const { email, password, nombre } = req.body;

    // Validar que los campos sean requeridos
    if (!email || !password || !nombre) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const result = await authService.register(email, password, nombre);
    res.status(201).json(result);
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Error al registrar usuario' });
  }
};

// Función para iniciar sesión
export const login = async (req: Request, res: Response) => {
  try {
    // Extraer datos del body
    const { email, password } = req.body;

    // Validar que los campos sean requeridos
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' });
      return;
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Error al iniciar sesión' });
  }
};

// Función para obtener el usuario actual
export const me = async (req: Request, res: Response) => {
  try {
    // Extraer datos del body
    const userId = (req as any).user.id;
    // Obtener usuario
    const user = await authService.me(userId);
    res.json(user);
  } catch (error: any) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message || 'Error al obtener usuario' });
  }
};
