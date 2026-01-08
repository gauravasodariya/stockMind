import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import forecastRoutes from "./routes/forecast.js";
import reportRoutes from "./routes/reports.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
