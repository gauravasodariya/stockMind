import express from "express";
import {
  getAllSales,
  uploadSalesCSV,
  getSalesByDateRange,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.get("/range", getSalesByDateRange);
// Accept JSON payloads from the dashboard CSV importer
router.post("/upload", uploadSalesCSV);

export default router;
