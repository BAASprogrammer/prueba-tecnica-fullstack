import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { getAll, getById, create, update, remove } from './solicitudes.controller';

const router = Router();

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;
