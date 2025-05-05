import express from 'express';
import cors from 'cors';
import moonRoutes from './moonRoutes.js';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use('/api', moonRoutes);
dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});