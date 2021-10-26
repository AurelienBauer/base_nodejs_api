import { Router } from 'express';
import { status } from '../controllers/sys.controller.js';
import auth from './auth.route.js';

const router = Router();

router.get('/status', status);

router.use('/auth', auth);

export default router;
