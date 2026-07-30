import { Router } from 'express';
import { register, login, me } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, nombre]
 *             properties:
 *               email:  { type: string, example: "admin@correo.cl" }
 *               password: { type: string, example: "123456" }
 *               nombre:  { type: string, example: "Admin" }
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:  { type: string, example: "admin@correo.cl" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Token requerido o inválido
 */
router.get('/me', authenticate, me);

export default router;
