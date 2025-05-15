import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import moonRoutes from './moonRoutes.js';
import horoscopeRoute from './scripts/horoscopeRoute.js';
import retroRoute from './scripts/retroRoute.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  keyGenerator: (req) => req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
  message: "⏳ Too many requests, please slow down.",
});
app.use(limiter);

app.use('/api', moonRoutes);
app.use('/api', horoscopeRoute);
app.use('/api', retroRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});