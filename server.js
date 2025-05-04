const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/moon-phases", async (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const from = `${year}-${month}-01`;
  const to = `${year}-${month}-31`;

  try {
    const response = await axios.post(
      "https://api.astronomyapi.com/api/v2/studio/moon-phase/calendar",
      {
        style: "sketch",
        format: "png",
        observer: {
          latitude: 56.95,
          longitude: 24.1,
          date: from
        },
        view: {
          type: "calendar",
          date: {
            from,
            to
          }
        }
      },
      {
        headers: {
          "Authorization": `Basic ${Buffer.from(
            `${process.env.ASTRONOMY_APP_ID}:${process.env.ASTRONOMY_APP_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data.data);
  } catch (error) {
    console.error("Error fetching moon phase data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch moon phase data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Moon backend running on port ${PORT}`));
