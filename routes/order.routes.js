import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import {
  getBuyerOrders,
  getProducerOrders,
  getOrderDetail,
  updateStatusProduk
} from '../controllers/order.controller.js';

const router = express.Router();

// Untuk Konsumen
router.get('/', verifyToken, checkRole('konsumen'), getBuyerOrders);

// Untuk Produsen
router.get('/produsen', verifyToken, checkRole('produsen'), getProducerOrders);
router.get('/:id', verifyToken, checkRole('produsen'), getOrderDetail);
router.put('/:id/status', verifyToken, checkRole('produsen'), updateStatusProduk);

export default router;
