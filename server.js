import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import moonRoutes from './moonRoutes.js';
import horoscopeRoute from './scripts/horoscopeRoute.js';
import retroRoute from './scripts/retroRoute.js';
import eclipseRoute from './scripts/eclipseRoute.js';
import visitRoute from './routes/visitRoute.js';

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://cosmoadiuvo.com",
  "https://www.cosmoadiuvo.com",
  "http://localhost:5173"
];

app.options('*', cors());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  keyGenerator: (req) =>
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  message: "⏳ Too many requests, please slow down.",
});
app.use(limiter);

app.use('/api/moon', moonRoutes);
app.use('/api/horoscope', horoscopeRoute);
app.use('/api/retro', retroRoute);
app.use('/api/eclipse', eclipseRoute);
app.use('/api/visit', visitRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});