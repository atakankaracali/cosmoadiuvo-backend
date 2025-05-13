import express from "express";
import axios from "axios";
import { sanitizeInput, hasAdvancedInjection, isTooLong } from "../utils/secureInput.js";
import { logToFile } from "../utils/logUtils.js"; // ayrı dosyada tutman daha iyi
const router = express.Router();

router.post("/generate-horoscope", async (req, res) => {
  const { sign, date, lang } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const ua = req.headers["user-agent"] || "unknown";

  if (!sign || !date || !lang) {
    return res.status(400).json({ error: "Missing input fields" });
  }

  if ([sign, date, lang].some((v) => isTooLong(v))) {
    return res.status(400).json({ error: "Input too long" });
  }

  if ([sign, date, lang].some((v) => hasAdvancedInjection(v))) {
    logToFile(ip, { warning: "INJECTION BLOCKED", body: req.body }, ua);
    return res.status(400).json({ error: "Potential injection attempt" });
  }

  const safeSign = sanitizeInput(sign);
  const safeDate = sanitizeInput(date);
  const safeLang = sanitizeInput(lang);

  const prompt = `
Give a **realistic and non-generic** daily horoscope for the zodiac sign "${safeSign}" on ${safeDate}.
Respond in "${safeLang}" language.

Structure your response **strictly like this**:
1. A short but insightful paragraph describing the overall emotional/mental/spiritual tone of the day.

2. Then rate these 4 areas based on real planetary influences (0 to 5 stars):
- Love
- Luck
- Career
- Health

Format like this:
- Love: X/5
- Luck: X/5
- Career: X/5
- Health: X/5

Rules:
- Don’t use the same rating for all
- Be thoughtful, realistic, and astrologically influenced
- Do not return explanation or intro. Only the paragraph + ratings
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        temperature: 1.1,
        top_p: 0.9,
        presence_penalty: 0.5,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://www.cosmoadiuvo.com",
          "X-Title": "CosmoAdiuvo Horoscope AI",
        },
      }
    );

    const raw = response.data.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("AI response is empty");

    const [generalMessage, ...ratingsLines] = raw.split("\n").filter((l) => l.trim().length > 0);

    const ratings = {
      love: 0,
      luck: 0,
      career: 0,
      health: 0,
    };

    ratingsLines.forEach((line) => {
      if (/love/i.test(line)) ratings.love = parseInt(line.match(/\d/)?.[0] || "0");
      if (/luck/i.test(line)) ratings.luck = parseInt(line.match(/\d/)?.[0] || "0");
      if (/career/i.test(line)) ratings.career = parseInt(line.match(/\d/)?.[0] || "0");
      if (/health/i.test(line)) ratings.health = parseInt(line.match(/\d/)?.[0] || "0");
    });

    return res.json({
      sign: safeSign,
      date: safeDate,
      language: safeLang,
      generalMessage,
      ratings,
    });
  } catch (error) {
    const errData = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
    console.error("💥 Horoscope AI Error:", JSON.stringify(errData, null, 2));
    return res.status(500).json({ error: "Failed to generate horoscope" });
  }
});

export default router;
