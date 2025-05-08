import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/moon-data', (req, res) => {
  try {
    const filePath = path.resolve('./data/moon_data_2025_daily.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    res.json(jsonData);
  } catch (error) {
    console.error('❌ Moon data JSON read error:', error.message);
    res.status(500).json({ error: 'Moon data not available.' });
  }
});

export default router;