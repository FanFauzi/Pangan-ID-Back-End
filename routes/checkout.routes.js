import express from 'express';
import { handleCheckout } from '../controllers/checkout.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, handleCheckout);

export default router;
