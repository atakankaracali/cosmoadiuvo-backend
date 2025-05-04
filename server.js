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

  const y = Number(year) || new Date().getFullYear();
  const m = Number(month) || new Date().getMonth() + 1;

  const daysInMonth = new Date(y, m, 0).getDate();

  const results = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const url = `https://api.met.no/weatherapi/sunrise/2.0/.json?lat=56.95&lon=24.1&date=${dateStr}&offset=+03:00`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "CosmoAdiuvo/1.0 (atakan@cosmoadiuvo.com)",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Error fetching ${dateStr}: ${response.status} ${text}`);
        continue;
      }

      const data = await response.json();

      const phaseName = data?.location?.time?.[0]?.moonphase?.value || "Unknown";

      results.push({
        date: dateStr,
        phase: { name: phaseName },
      });
    } catch (err) {
      console.error(`❌ JSON error for ${dateStr}:`, err.message);
    }
  }

  res.json({ calendar: results });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});