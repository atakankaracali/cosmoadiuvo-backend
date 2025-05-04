const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CosmoAdiuvo Moon Calendar API is running ✅");
});

app.get("/moon-calendar", async (req, res) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const response = await fetch(`https://api.astronomyapi.com/api/v2/studio/moon-calendar/month?latitude=56.95&longitude=24.1&month=${year}-${month}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(`${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_SECRET}`).toString("base64")}`
    },
  });

  const data = await response.json();

  if (response.ok) {
    res.json(data.data);
  } else {
    res.status(500).json({ error: "Failed to fetch moon data", details: data });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});