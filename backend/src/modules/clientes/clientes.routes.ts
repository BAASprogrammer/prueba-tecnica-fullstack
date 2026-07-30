import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { getAll, autocomplete } from './clientes.controller';

const router = Router();

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', authenticate, getAll);

/**
 * @swagger
 * /clientes/autocomplete:
 *   get:
 *     summary: Autocompletar datos de cliente por RUT o email
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *         description: RUT (12345678-9) o email
 *     responses:
 *       200:
 *         description: Datos del cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *       504:
 *         description: Tiempo de espera agotado al consultar API externa
 */
router.get('/autocomplete', authenticate, autocomplete);

export default router;
