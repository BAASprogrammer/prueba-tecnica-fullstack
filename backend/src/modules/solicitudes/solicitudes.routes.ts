import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { getAll, getById, create, update, remove } from './solicitudes.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Solicitud:
 *       type: object
 *       properties:
 *         id:          { type: integer }
 *         number:      { type: string, example: "REQ-2026-013" }
 *         date:        { type: string, format: date-time }
 *         type:        { type: string, example: "Reclamo por servicio" }
 *         description: { type: string }
 *         status:      { type: string, enum: [PENDIENTE, EN_PROCESO, FINALIZADA, RECHAZADA] }
 *         clientId:    { type: integer }
 *         client:
 *           type: object
 *           properties:
 *             id:    { type: integer }
 *             name:  { type: string }
 *             email: { type: string }
 *             phone: { type: string }
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 */

/**
 * @swagger
 * /solicitudes:
 *   get:
 *     summary: Listar solicitudes paginadas
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 4 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: ["", PENDIENTE, EN_PROCESO, FINALIZADA, RECHAZADA] }
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Lista paginada de solicitudes
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticate, getAll);

/**
 * @swagger
 * /solicitudes/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Datos de la solicitud
 *       404:
 *         description: Solicitud no encontrada
 */
router.get('/:id', authenticate, getById);

/**
 * @swagger
 * /solicitudes:
 *   post:
 *     summary: Crear una nueva solicitud
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fecha, tipo, descripcion, estado, nombre, email, telefono]
 *             properties:
 *               fecha:       { type: string, format: date }
 *               tipo:        { type: string }
 *               descripcion: { type: string }
 *               estado:      { type: string, enum: [PENDIENTE, EN_PROCESO, FINALIZADA, RECHAZADA] }
 *               nombre:      { type: string, description: "Nombre del cliente" }
 *               email:       { type: string, format: email }
 *               telefono:    { type: string, example: "+56912345678" }
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       400:
 *         description: Error de validación
 */
router.post('/', authenticate, create);

/**
 * @swagger
 * /solicitudes/{id}:
 *   put:
 *     summary: Actualizar una solicitud (incluye datos del cliente)
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:       { type: string, format: date }
 *               tipo:        { type: string }
 *               descripcion: { type: string }
 *               estado:      { type: string, enum: [PENDIENTE, EN_PROCESO, FINALIZADA, RECHAZADA] }
 *               nombre:      { type: string }
 *               email:       { type: string, format: email }
 *               telefono:    { type: string }
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Solicitud no encontrada
 */
router.put('/:id', authenticate, update);

/**
 * @swagger
 * /solicitudes/{id}:
 *   delete:
 *     summary: Eliminar una solicitud
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Eliminada exitosamente (sin contenido)
 *       404:
 *         description: Solicitud no encontrada
 */
router.delete('/:id', authenticate, remove);

export default router;
