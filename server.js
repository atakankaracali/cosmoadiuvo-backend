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
  const { year, month } = req.query;

  const y = parseInt(year) || new Date().getFullYear();
  const m = parseInt(month) || new Date().getMonth() + 1;
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const end = `${y}-${String(m).padStart(2, "0")}-${new Date(y, m, 0).getDate()}`;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=56.95&longitude=24.1&daily=moon_phase&timezone=Europe/Riga&start_date=${start}&end_date=${end}`;

  console.log(`📡 Fetching Moon Phase from Open-Meteo: ${start} to ${end}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data?.daily?.time || !data?.daily?.moon_phase) {
      console.error("💥 Moon API error: Incomplete moon data from API");
      return res.status(500).json({ error: "Moon data fetch failed", details: "Incomplete moon data from API" });
    }

    const calendar = data.daily.time.map((date, i) => {
      const value = data.daily.moon_phase[i];
      return {
        date,
        phase: {
          name: getMoonPhaseName(value),
        },
      };
    });

    res.json({ calendar });
  } catch (err) {
    console.error("💥 Moon API error:", err.message);
    res.status(500).json({ error: "Moon data fetch failed", details: err.message });
  }
});

function getMoonPhaseName(value) {
  if (value === 0) return "New Moon";
  if (value < 0.25) return "Waxing Crescent";
  if (value === 0.25) return "First Quarter";
  if (value < 0.5) return "Waxing Gibbous";
  if (value === 0.5) return "Full Moon";
  if (value < 0.75) return "Waning Gibbous";
  if (value === 0.75) return "Last Quarter";
  return "Waning Crescent";
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});