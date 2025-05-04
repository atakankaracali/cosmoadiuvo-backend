import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌕 CosmoAdiuvo Moon Calendar API is live!");
});

app.get("/moon-calendar", async (req, res) => {
  const today = new Date();
  const year = req.query.year || today.getFullYear();
  const month = String(req.query.month || today.getMonth() + 1).padStart(2, "0");

  console.log(`📡 Fetching Moon Calendar for: ${year}-${month}`);
  console.log(`🔐 Using credentials: ${process.env.ASTRONOMY_APP_ID} / [HIDDEN]`);

  const credentials = `${process.env.ASTRONOMY_APP_ID}:${process.env.ASTRONOMY_APP_SECRET}`;
  const encoded = Buffer.from(credentials).toString("base64");
  const apiUrl = `https://api.astronomyapi.com/api/v2/studio/moon-calendar/month?latitude=56.95&longitude=24.1&month=${year}-${month}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encoded}`
      },
    });

    const raw = await response.text();
    console.log("📦 Raw response from AstronomyAPI:", raw);

    const data = JSON.parse(raw);

    if (!data?.data?.calendar) {
      console.error("❌ API response does not contain 'data.calendar'.");
      throw new Error("No moon data from AstronomyAPI");
    }

    const calendar = data.data.calendar.map(day => ({
      date: day.date,
      image: day.image?.url,
      phase: {
        name: day.phase.name,
        svg: day.svg?.image
      }
    }));

    res.json({ calendar });
  } catch (error) {
    console.error("💥 Moon API error:", error);
    res.status(500).json({ error: "Moon data fetch failed", details: error.message || error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});