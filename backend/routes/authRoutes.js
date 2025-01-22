import express from "express";
import {
  authGoogle,
  authGoogleCallback,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", authGoogleCallback);
router.get("/events", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).send("Unauthorized");
    }

    const events = await getCalendarEvents(req.session.tokens);
    res.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).send("Error fetching calendar events");
  }
});

export default router;
