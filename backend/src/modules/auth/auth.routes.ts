import { Router } from 'express';
import { register, login, me } from './auth.controller';
import { authenticate } from './auth.middleware';

// Crear router
const router = Router();

// Rutas
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;
