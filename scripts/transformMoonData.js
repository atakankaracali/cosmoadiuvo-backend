import fs from "fs";

const inputPath = "./data/moon_data_2025.json";
const outputPath = "./data/moon_data_2025_daily.json";

const getPhaseName = (phase) => {
  if (phase < 1) return "New Moon";
  if (phase < 50) return "Waxing Crescent";
  if (phase < 51) return "First Quarter";
  if (phase < 99) return "Waxing Gibbous";
  if (phase >= 99) return "Full Moon";
  if (phase > 50 && phase < 99) return "Waning Gibbous";
  if (phase > 49 && phase < 51) return "Last Quarter";
  return "Waning Crescent";
};

const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const dailyData = [];

let lastDate = "";

rawData.forEach((entry) => {
  const [dayStr, monthStr, yearStr, hour] = entry.time.split(" ");

  if (entry.time.includes("12:00 UT")) {
    const formatted = {
      date: `${yearStr}-${String(
        new Date(`${dayStr} ${monthStr} ${yearStr}`).getMonth() + 1
      ).padStart(2, "0")}-${dayStr.padStart(2, "0")}`,
      phase: getPhaseName(entry.phase),
      illumination: `${Math.round(entry.phase)}%`,
    };

    dailyData.push(formatted);
  }
});

fs.writeFileSync(outputPath, JSON.stringify(dailyData, null, 2), "utf-8");

console.log(`✅ Created simplified daily moon data with ${dailyData.length} entries.`);
