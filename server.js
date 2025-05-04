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
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month || String(new Date().getMonth() + 1).padStart(2, "0");

  const credentials = `${process.env.ASTRONOMY_APP_ID}:${process.env.ASTRONOMY_APP_SECRET}`;
  const authHeader = `Basic ${Buffer.from(credentials).toString("base64")}`;

  const url = `https://api.astronomyapi.com/api/v2/studio/moon-calendar/month?latitude=56.95&longitude=24.1&month=${year}-${month}`;

  console.log(`📡 Fetching Moon Calendar for: ${year}-${month}`);
  console.log(`🔐 Using credentials: ${process.env.ASTRONOMY_APP_ID} / [HIDDEN]`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    });

    const data = await response.json();
    console.log("📦 Raw response from AstronomyAPI:", JSON.stringify(data, null, 2));

    if (!data?.data?.calendar) {
      throw new Error("No moon data from AstronomyAPI");
    }

    const calendar = data.data.calendar.map(day => ({
      date: day.date,
      image: day.image?.url,
      phase: {
        name: day.phase.name,
        svg: day.svg?.url || "",
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