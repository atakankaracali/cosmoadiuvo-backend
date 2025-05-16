import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/month', (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'Missing year or month parameter.' });
  }

  try {
    const rawData = fs.readFileSync(`./data/moon_data_${year}_daily.json`, 'utf-8');
    const allData = JSON.parse(rawData);
    const filtered = allData.filter(item => item.date.startsWith(`${year}-${month.padStart(2, '0')}`));
    res.json(filtered);
  } catch (error) {
    console.error('❌ Moon data fetch error:', error.message);
    res.status(500).json({ error: 'Moon data not available.' });
  }
});

export default router;