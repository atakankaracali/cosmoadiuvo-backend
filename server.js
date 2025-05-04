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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const url = `https://aa.usno.navy.mil/api/moon/phases/year?year=${year}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.phasedata) throw new Error("No phase data received from USNO");

    const calendar = data.phasedata
      .filter((phase) => phase.month === month)
      .map((phase) => {
        const date = `${phase.year}-${String(phase.month).padStart(2, "0")}-${String(phase.day).padStart(2, "0")}`;
        return {
          date,
          phase: { name: phase.phase },
          image: getMoonImageURL(phase.phase),
        };
      });

    res.json({ calendar });
  } catch (error) {
    console.error("Moon API error:", error);
    res.status(500).json({ error: "Moon data fetch failed", details: error.message || error });
  }
});

function getMoonImageURL(phaseName) {
  const slug = phaseName.toLowerCase().replace(/ /g, "-");
  return `https://cosmoadiuvo-assets.vercel.app/moon/${slug}.png`;
}

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});