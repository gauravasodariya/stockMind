import { Readable } from "stream";
import csv from "csv-parser";

let sales = [
  {
    id: 1,
    date: "2024-10-24",
    orderId: "#ORD-7782",
    product: "UltraBoost Runners",
    quantity: 2,
    amount: 360,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-10-23",
    orderId: "#ORD-7788",
    product: "Smart Watch Series 5",
    quantity: 1,
    amount: 299,
    status: "Completed",
  },
];

export const getAllSales = (req, res) => {
  res.json(sales);
};

export const getSalesByDateRange = (req, res) => {
  const { startDate, endDate, region } = req.query;

  let filtered = sales;

  if (startDate) {
    filtered = filtered.filter((s) => new Date(s.date) >= new Date(startDate));
  }

  if (endDate) {
    filtered = filtered.filter((s) => new Date(s.date) <= new Date(endDate));
  }

  res.json(filtered);
};

export const uploadSalesCSV = (req, res) => {
  try {
    const { sales: importedSales } = req.body;

    if (!importedSales || !Array.isArray(importedSales)) {
      return res
        .status(400)
        .json({ error: "Invalid data format. Expected sales array." });
    }

    if (importedSales.length === 0) {
      return res.status(400).json({ error: "No sales data provided" });
    }

    const results = [];
    const maxId = Math.max(...sales.map((s) => s.id || 0), 0);

    importedSales.forEach((row, idx) => {
      try {
        const sale = {
          id: maxId + idx + 1,
          date: row.date || new Date().toISOString().split("T")[0],
          orderId:
            row.orderId || `#ORD-${Math.random().toString(36).substr(2, 9)}`,
          product: row.product || row.Product || "Unknown",
          quantity: parseInt(row.quantity || row.Quantity || 1),
          amount: parseFloat(row.amount || row.Amount || 0),
          region: row.region || row.Region || "Unknown",
          status: row.status || row.Status || "Completed",
          createdAt: new Date(),
        };
        results.push(sale);
        sales.push(sale);
      } catch (err) {
        console.error(`Error processing row ${idx}:`, err);
      }
    });

    res.json({
      success: true,
      count: results.length,
      message: `${results.length} records uploaded successfully`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
