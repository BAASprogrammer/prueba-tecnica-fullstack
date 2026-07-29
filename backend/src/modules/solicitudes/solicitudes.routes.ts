import { Router } from 'express';
import { getAll } from './solicitudes.controller';

// Crear router
const router = Router();

// Rutas
router.get('/', getAll);

// Exportar router
export default router;
