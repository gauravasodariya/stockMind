import express from "express";
import {
  generateForecast,
  getAIAnalysis,
  getForecastHistory,
} from "../controllers/forecastController.js";

const router = express.Router();

router.post("/generate", generateForecast);
router.get("/analysis", getAIAnalysis);
router.get("/history", getForecastHistory);

export default router;
