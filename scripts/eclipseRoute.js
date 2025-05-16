import express from 'express';
import eclipseData from '../data/eclipse-2025-2030.json' assert { type: 'json' };

const router = express.Router();

router.get('/', (req, res) => {
  res.json(eclipseData);
});

export default router;
