// app.js
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import orderRoutes from './routes/order.routes.js';
import priceRoutes from './routes/price.routes.js';
import pihpsRoutes from './routes/pihps.routes.js';


const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/produk', productsRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/order', orderRoutes);
app.use('/api', priceRoutes);
app.use('/api', pihpsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
