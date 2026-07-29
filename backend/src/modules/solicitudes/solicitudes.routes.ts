import { Router } from 'express';
import { getAll, updateStatus } from './solicitudes.controller';

// Crear router
const router = Router();

// Rutas
router.get('/', getAll);
router.put('/:id', updateStatus);

// Exportar router
export default router;
