// app.js
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
