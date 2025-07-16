import express from 'express';
import upload from '../middlewares/upload.middlewares.js';
import { addProduct, getAllProducts, getProductById, putProduct, deleteProduct } from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/tambah-produk', verifyToken, upload.single('image'), addProduct);
router.get('/', verifyToken, getAllProducts);
router.get('/:id', verifyToken, getProductById);
router.put('/:id', verifyToken, upload.single('image'), putProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
