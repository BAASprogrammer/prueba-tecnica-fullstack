import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'secret_dev_key';

// Autenticar usuario
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Obtener header de autorización
  const header = req.headers.authorization;
  // Si no existe el header lanzar error
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  // Extraer el token
  const token = header.split(' ')[1];
  // Si el token no existe lanzar error
  if (!token) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
  // Verificar token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
