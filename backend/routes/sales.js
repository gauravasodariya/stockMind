import express from "express";
import multer from "multer";
import {
  getAllSales,
  uploadSalesCSV,
  getSalesByDateRange,
} from "../controllers/salesController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllSales);
router.get("/range", getSalesByDateRange);
router.post("/upload", upload.single("file"), uploadSalesCSV);

export default router;
