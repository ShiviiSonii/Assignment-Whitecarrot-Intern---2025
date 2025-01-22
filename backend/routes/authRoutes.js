import express from "express";
import {
  authGoogle,
  authGoogleCallback,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/auth/google", authGoogle);
router.get("/auth/google/callback", authGoogleCallback);

export default router;
