import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import { getCalendarEvents } from "./services/googleAuthService.js";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  cors()
  //   {
  //   // origin: process.env.FRONTEND_URL,
  //   origin: ["https://assignment-whitecarrot-intern-2025-beta.vercel.app"],
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   credentials: true,
  // }
);

// console.log(process.env.FRONTEND_URL);

app.use(authRoutes);

app.get("/events", async (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
