import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌕 CosmoAdiuvo Real Moon Calendar API is live!");
});

app.get("/moon-calendar", async (req, res) => {
  const { year, month } = req.query;

  const currentYear = new Date().getFullYear();
  const y = parseInt(year) || currentYear;
  const m = parseInt(month) || new Date().getMonth() + 1;

  const daysInMonth = new Date(y, m, 0).getDate();
  const results = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const url = `https://api.met.no/weatherapi/sunrise/2.0/.json?lat=56.95&lon=24.1&date=${dateStr}&offset=+03:00`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "cosmoadiuvo/1.0",
        },
      });
      const data = await response.json();
      const moonphase = data?.location?.time?.[0]?.moonphase?.value;

      if (moonphase !== undefined) {
        results.push({
          date: dateStr,
          phase: {
            name: getPhaseName(parseFloat(moonphase)),
            value: parseFloat(moonphase),
          },
        });
      }
    } catch (error) {
      console.error(`❌ Error fetching data for ${dateStr}`, error.message || error);
    }
  }

  res.json({ calendar: results });
});

function getPhaseName(value) {
  if (value === 0) return "New Moon";
  if (value > 0 && value < 0.25) return "Waxing Crescent";
  if (value === 0.25) return "First Quarter";
  if (value > 0.25 && value < 0.5) return "Waxing Gibbous";
  if (value === 0.5) return "Full Moon";
  if (value > 0.5 && value < 0.75) return "Waning Gibbous";
  if (value === 0.75) return "Last Quarter";
  return "Waning Crescent";
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});