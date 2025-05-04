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
  
    try {
      const response = await fetch(`https://api.astronomyapi.com/api/v2/studio/moon-calendar/month?latitude=56.95&longitude=24.1&month=${year}-${month}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${process.env.ASTRONOMY_APP_ID}:${process.env.ASTRONOMY_APP_SECRET}`).toString("base64")}`
        },
      });
  
      const data = await response.json();
  
      if (!data?.data?.table?.rows) {
        throw new Error("No moon data from AstronomyAPI");
      }
  
      const calendar = data.data.table.rows.map((row) => ({
        date: row.date,
        phase: {
          name: row.entries[0]?.phase?.name || "Unknown",
          svg: row.entries[0]?.image?.svg || ""
        }
      }));
  
      res.json({ calendar });
    } catch (error) {
      console.error("Moon API error:", error);
      res.status(500).json({ error: "Moon data fetch failed", details: error.message || error });
    }
  });  

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});