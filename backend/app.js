import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import { getCalendarEvents } from "./services/googleAuthService.js";

const app = express();
const port = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
