import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { getAll, autocomplete } from './clientes.controller';

const router = Router();

router.get('/', authenticate, getAll); // GET /clientes
router.get('/autocomplete', authenticate, autocomplete); // GET /clientes/autocomplete

export default router;
