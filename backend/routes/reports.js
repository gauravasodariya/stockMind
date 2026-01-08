import express from "express";
import {
  generateReport,
  getReportById,
  listReports,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.get("/", listReports);
router.get("/:id", getReportById);

export default router;
