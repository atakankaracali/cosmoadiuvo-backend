import express from 'express';
import axios from 'axios';

const router = express.Router();

const API_KEY = process.env.MOON_API_KEY;
const BASE_URL = 'https://api.ipgeolocation.io/astronomy';

router.get('/moon', async (req, res) => {
    const { date, lat, long } = req.query;

    if (!date || !lat || !long) {
        return res.status(400).json({ error: 'Missing date or coordinates (lat, long)' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apiKey: API_KEY,
                date,
                lat,
                long,
            },
        });

        const data = response.data;

        const phase = data.moon_phase || 'Unknown';
        const moonrise = data.moonrise || 'N/A';
        const moonset = data.moonset || 'N/A';

        res.json({
            date,
            location: `${lat},${long}`,
            phase,
            moonrise,
            moonset,
        });
    } catch (error) {
        console.error('Moon API error:', error.message);
        res.status(500).json({ error: 'Failed to fetch moon data' });
    }
});

export default router;