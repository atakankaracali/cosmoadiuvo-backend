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
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const daysInMonth = new Date(year, month, 0).getDate();

    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${daysInMonth}`;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=56.95&longitude=24.1&daily=moon_phase&timezone=Europe/Riga&start_date=${startDate}&end_date=${endDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ Open-Meteo Response:", JSON.stringify(data, null, 2));

        if (!data.daily || !data.daily.time || !data.daily.moon_phase) {
            throw new Error("Incomplete moon data from API");
        }

        const calendar = data.daily.time.map((date, idx) => {
            const phaseValue = data.daily.moon_phase[idx];
            return {
                date,
                phase: {
                    name: getPhaseName(phaseValue),
                },
                image: getMoonImageURL(phaseValue),
            };
        });

        res.json({ calendar });
    } catch (error) {
        console.error("Moon API error:", error);
        res.status(500).json({ error: "Moon data fetch failed", details: error.message || error });
    }
});

function getPhaseName(value) {
    if (value === 0) return "New Moon";
    if (value < 0.25) return "Waxing Crescent";
    if (value === 0.25) return "First Quarter";
    if (value < 0.5) return "Waxing Gibbous";
    if (value === 0.5) return "Full Moon";
    if (value < 0.75) return "Waning Gibbous";
    if (value === 0.75) return "Last Quarter";
    return "Waning Crescent";
}

function getMoonImageURL(value) {
    const phase = getPhaseName(value).toLowerCase().replace(/ /g, "-");
    return `https://cosmoadiuvo-assets.vercel.app/moon/${phase}.png`;
}

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});