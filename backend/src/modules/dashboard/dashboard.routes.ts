import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { getStats } from './dashboard.controller';

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:      { type: integer }
 *                 pending:    { type: integer }
 *                 completed:  { type: integer }
 *                 inProgress: { type: integer }
 */
router.get('/', authenticate, getStats);

export default router;
