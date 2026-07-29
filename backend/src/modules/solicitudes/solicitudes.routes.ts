import { Router } from 'express';
import { getAll, updateStatus, remove } from './solicitudes.controller';

// Crear router
const router = Router();

// Rutas
router.get('/', getAll); // GET /solicitudes
router.put('/:id', updateStatus); // PUT /solicitudes/:id
router.delete('/:id', remove); // DELETE /solicitudes/:id

// Exportar router
export default router;
