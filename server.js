const express = require('express');
const cors = require('cors');
const moonRoutes = require('./moonRoutes');

const app = express();
app.use(cors());
app.use('/api', moonRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});