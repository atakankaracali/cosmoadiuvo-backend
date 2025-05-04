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
  const queryYear = parseInt(req.query.year);
  const queryMonth = parseInt(req.query.month);

  const today = new Date();
  const year = !isNaN(queryYear) ? queryYear : today.getFullYear();
  const month = !isNaN(queryMonth) && queryMonth >= 1 && queryMonth <= 12 ? queryMonth : today.getMonth() + 1;

  const monthStr = String(month).padStart(2, "0");
  const startDate = `${year}-${monthStr}-01`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const endDate = `${year}-${monthStr}-${String(daysInMonth).padStart(2, "0")}`;

  console.log(`📡 Fetching Moon Phase from Open-Meteo: ${startDate} to ${endDate}`);

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=56.95&longitude=24.1&daily=moon_phase&timezone=Europe/Riga&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();

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
        },
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