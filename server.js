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

    const calendar = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year}-${month}-${String(i).padStart(2, "0")}`;
        const phaseValue = (i / daysInMonth) % 1;
        calendar.push({
            date,
            phase: {
                name: getPhaseName(phaseValue),
                value: phaseValue
            }
        });
    }

    res.json({ calendar });
});

function getMoonImageURL(phaseName) {
    const slug = phaseName.toLowerCase().replace(/ /g, "-");
    return `https://cosmoadiuvo-assets.vercel.app/moon/${slug}.png`;
}

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});