import { getAuthUrl, getTokens } from "../services/googleAuthService.js";

export const authGoogle = (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

export const authGoogleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokens = await getTokens(code);
    req.session.tokens = tokens;
    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.status(500).send("Authentication failed");
  }
};
