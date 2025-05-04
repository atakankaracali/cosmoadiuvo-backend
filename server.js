import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌕 CosmoAdiuvo Moon Calendar API is live!");
});

app.get("/moon-calendar", async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;

  if (month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month" });
  }

  const daysInMonth = new Date(year, month, 0).getDate();

  const calendar = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const phaseValue = (i / daysInMonth) % 1;
    calendar.push({
      date,
      phase: {
        name: getPhaseName(phaseValue),
        value: phaseValue.toFixed(2),
      }
    });
  }

  res.json({ calendar });
});

function getPhaseName(value) {
  value = Number(value);
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