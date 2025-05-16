import express from 'express';
import retroData from '../data/retroData.json' assert { type: 'json' };

const router = express.Router();

router.get('/', (req, res) => {
  res.json(retroData);
});

export default router;