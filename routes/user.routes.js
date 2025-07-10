import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);

export default router;
