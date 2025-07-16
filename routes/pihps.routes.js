import express from 'express';
import { fetchPIHPS } from '../services/fetchPIHPS.js';

const router = express.Router();

router.get('/pihps', async (req, res) => {
  const data = await fetchPIHPS();
  res.json({ data });
});

export default router;
