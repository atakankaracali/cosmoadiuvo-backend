import express from 'express';
import axios from 'axios';

const router = express.Router();

const API_KEY = process.env.MOON_API_KEY;
const BASE_URL = 'https://api.ipgeolocation.io/astronomy';

router.get('/moon', async (req, res) => {
  const { date, location } = req.query;

  if (!date || !location) {
    return res.status(400).json({ error: 'Missing date or location' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { apiKey: API_KEY, date, location },
    });
    const data = response.data;
    res.json({
      date,
      location,
      phase: data.moon_phase,
      illumination: data.moon_illumination,
      moonrise: data.moonrise,
      moonset: data.moonset,
      image: `https://moonphase.app/images/${data.moon_phase.toLowerCase().replace(/\s+/g, '-')}.png`,
    });
  } catch (error) {
    console.error('Moon API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch moon data' });
  }
});

export default router;