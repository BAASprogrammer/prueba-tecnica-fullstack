import { Router } from 'express';
import { getAll } from './clientes.controller';

const router = Router();

router.get('/', getAll); // GET /clientes

export default router;
