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

  const y = parseInt(year || new Date().getFullYear());
  const m = parseInt(month || new Date().getMonth() + 1);
  const monthStr = String(m).padStart(2, "0");

  const daysInMonth = new Date(y, m, 0).getDate();
  const startDate = `${y}-${monthStr}-01`;
  const endDate = `${y}-${monthStr}-${daysInMonth}`;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=56.95&longitude=24.1&daily=moon_phase&timezone=Europe/Riga&start_date=${startDate}&end_date=${endDate}`;

  console.log(`📡 Fetching Moon Phase from Open-Meteo: ${startDate} to ${endDate}`);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("📦 Open-Meteo response:", JSON.stringify(data, null, 2));

    if (!data.daily || !data.daily.time || !data.daily.moon_phase) {
      throw new Error("Incomplete moon data from API");
    }

    const calendar = data.daily.time.map((date, idx) => {
      const phaseValue = data.daily.moon_phase[idx];
      return {
        date,
        phase: {
          name: getPhaseName(phaseValue),
          value: phaseValue,
          svg: `https://cosmoadiuvo-assets.vercel.app/moon/${getPhaseName(phaseValue).toLowerCase().replace(/ /g, "-")}.svg`
        }
      };
    });

    res.json({ calendar });
  } catch (error) {
    console.error("💥 Moon API error:", error);
    res.status(500).json({ error: "Moon data fetch failed", details: error.message || error });
  }
});

function getPhaseName(value) {
  if (value < 0.03 || value > 0.97) return "New Moon";
  if (value < 0.22) return "Waxing Crescent";
  if (value < 0.28) return "First Quarter";
  if (value < 0.47) return "Waxing Gibbous";
  if (value < 0.53) return "Full Moon";
  if (value < 0.72) return "Waning Gibbous";
  if (value < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});