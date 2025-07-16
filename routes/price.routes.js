import express from 'express';
import { fetchPIHPS } from '../services/fetchPIHPS.js';
const router = express.Router();

router.get('/prices', async (req, res) => {
  const { region = 'Nasional', market = 'tradisional' } = req.query;

  try {
    const data = await fetchPIHPS(region, market);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal fetch harga pangan' });
  }
});

export default router;
