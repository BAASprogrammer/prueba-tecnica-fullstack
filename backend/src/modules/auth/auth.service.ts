import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authRepository from './auth.repository';

// JWT SECRET
const JWT_SECRET: string = process.env.JWT_SECRET as string;

// Generar token
const signToken = (user: { id: number; email: string; role: string }) =>
  jwt.sign({ id: user.id, email: user.email, rol: user.role }, JWT_SECRET, { expiresIn: '8h' });

// Registrar usuario
export const register = async (email: string, password: string, nombre: string) => {
  const existing = await authRepository.findByEmail(email);
  // si el usuario existe lanzar error
  if (existing) {
    throw { status: 409, message: 'El email ya está registrado' };
  }
  // generar hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await authRepository.create({ email, password: hashedPassword, nombre });
  // devolver solo el token y el usuario
  return {
    token: signToken(user),
    user: { id: user.id, email: user.email, nombre: user.name, rol: user.role },
  };
};

// Iniciar sesión
export const login = async (email: string, password: string) => {
  // buscar usuario por email
  const user = await authRepository.findByEmail(email);
  // si el usuario no existe lanzar error
  if (!user) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  const valid = await bcrypt.compare(password, user.password);
  // si la contraseña es incorrecta lanzar error
  if (!valid) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }
  // devolver solo el token y el usuario
  return {
    token: signToken(user),
    user: { id: user.id, email: user.email, nombre: user.name, rol: user.role },
  };
};

// Obtener perfil del usuario
export const me = async (userId: number) => {
  // buscar usuario por id
  const user = await authRepository.findById(userId);
  // si el usuario no existe lanzar error
  if (!user) {
    throw { status: 404, message: 'Usuario no encontrado' };
  }
  // devolver solo el usuario sin el token
  return user;
};
