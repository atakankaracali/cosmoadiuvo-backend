import express from "express";
import { db } from "../config/firebase";

const router = express.Router();

router.post("/", async (req, res) => {
  const ref = db.collection("siteStats").doc("visitCount");

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const count = (doc.data()?.count || 0) + 1;
      t.set(ref, { count });
    });

    const updated = await ref.get();
    res.json({ count: updated.data()?.count });
  } catch (err) {
    console.error("Visit counter error:", err);
    res.status(500).json({ error: "Counter update failed." });
  }
});

export default router;
