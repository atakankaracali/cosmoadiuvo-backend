const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.MOON_API_KEY || 'your_api_key_here';
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
      date: date,
      location: location,
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

module.exports = router;
