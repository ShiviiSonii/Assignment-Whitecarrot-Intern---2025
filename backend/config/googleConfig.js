import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

export const SCOPES = ["https://www.googleapis.com/auth/calendar"];
