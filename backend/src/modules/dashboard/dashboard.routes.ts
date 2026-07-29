import { Router } from 'express';
import { getStats } from './dashboard.controller';

const router = Router();

router.get('/', getStats); // GET /dashboard

export default router;
