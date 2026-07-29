import { Router } from 'express';
import { getAll, getById, update, remove } from './solicitudes.controller';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
