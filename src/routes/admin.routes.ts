import { Router } from 'express';
import { signup, login } from '../controllers/admin.controller';

const router = Router();

// POST /api/admin/signup
router.post('/signup', signup);

// POST /api/admin/login
router.post('/login', login);

export default router;