import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌕 CosmoAdiuvo Moon Calendar API is live!");
});

app.get("/moon-calendar", async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  const month = parseInt(req.query.month || (new Date().getMonth() + 1));

  const url = `https://raw.githubusercontent.com/andrmoel/astrodata/main/moonphases/${year}.json`;

  console.log(`📡 Fetching Moon Phase for ${year}-${String(month).padStart(2, "0")}`);
  try {
    const response = await fetch(url);
    const data = await response.json();

    const filtered = data.filter(entry => {
      const date = new Date(entry.date);
      return date.getMonth() + 1 === month;
    });

    const calendar = filtered.map(entry => ({
      date: entry.date.slice(0, 10),
      phase: { name: entry.phase }
    }));

    console.log(`✅ Found ${calendar.length} moon phase days`);
    res.json({ calendar });
  } catch (err) {
    console.error("💥 Moon API error:", err.message);
    res.status(500).json({ error: "Moon data fetch failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});