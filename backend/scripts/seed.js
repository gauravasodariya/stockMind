import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

dotenv.config();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const rootDir = path.resolve(__dirname, "..", "..");
const productsCsvPath = path.join(rootDir, "sample-products.csv");
const salesCsvPath = path.join(rootDir, "sample-sales.csv");

const argDrop = process.argv.includes("--drop");

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function loadProductsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Normalize and map fields
        const item = {
          name: data.name || data.product || "Unnamed",
          sku: data.sku || data.SKU || data.id,
          category: data.category || "General",
          price: data.price ? Number(data.price) : undefined,
          stock: data.stock ? Number(data.stock) : undefined,
          region: data.region || "All",
          status: data.status || "active",
        };
        results.push(item);
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function loadSalesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const item = {
          date: data.date ? new Date(data.date) : new Date(),
          orderId: data.orderId || data.order_id || data.id,
          product: data.product || data.name || "Unknown",
          sku: data.sku || data.SKU,
          region: data.region || "All",
          quantity: data.quantity ? Number(data.quantity) : 1,
          amount: data.amount ? Number(data.amount) : undefined,
          status: data.status || "completed",
        };
        results.push(item);
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function generateDummyProducts() {
  const categories = [
    "Electronics",
    "Accessories",
    "Footwear",
    "Apparel",
    "Sports",
  ];
  const regions = ["North", "South", "East", "West", "Central"];
  const items = [];
  let idx = 1;
  for (const cat of categories) {
    for (let i = 1; i <= 4; i++) {
      items.push({
        name: `${cat} Item ${i}`,
        sku: `${cat.substring(0, 3).toUpperCase()}-${String(idx).padStart(
          4,
          "0"
        )}`,
        category: cat,
        price: Math.round(500 + Math.random() * 4500),
        stock: Math.round(20 + Math.random() * 180),
        region: regions[Math.floor(Math.random() * regions.length)],
        status: "active",
      });
      idx++;
    }
  }
  return items;
}

function generateDummySales(products) {
  const regions = ["North", "South", "East", "West", "Central"];
  const sales = [];
  const now = new Date();
  let orderSeq = 1000;

  for (let i = 0; i < 50; i++) {
    const p = products[Math.floor(Math.random() * products.length)];
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);

    const quantity = Math.ceil(Math.random() * 5);
    const amount = p.price
      ? p.price * quantity
      : Math.round(100 + Math.random() * 900);

    sales.push({
      date,
      orderId: `ORD-${orderSeq++}`,
      product: p.name,
      sku: p.sku,
      region: regions[Math.floor(Math.random() * regions.length)],
      quantity,
      amount,
      status: "completed",
    });
  }
  return sales;
}

async function seed() {
  await connectDB();

  if (argDrop) {
    console.log("Dropping existing collections...");
    try {
      await Product.deleteMany({});
      await Sale.deleteMany({});
      console.log("Collections cleared.");
    } catch (e) {
      console.warn("Warning clearing collections:", e.message);
    }
  }

  // Products
  let products = [];
  if (fileExists(productsCsvPath)) {
    console.log(`Loading products from CSV: ${productsCsvPath}`);
    products = await loadProductsFromCSV(productsCsvPath);
  } else {
    console.log("CSV not found; generating dummy products...");
    products = generateDummyProducts();
  }

  // Insert products (upsert on sku)
  let productInserted = 0;
  for (const p of products) {
    if (!p.sku || !p.name) continue;
    try {
      await Product.updateOne({ sku: p.sku }, { $set: p }, { upsert: true });
      productInserted++;
    } catch (e) {
      console.warn(`Product upsert failed for ${p.sku}:`, e.message);
    }
  }
  console.log(`Products upserted: ${productInserted}`);

  // Sales
  let sales = [];
  if (fileExists(salesCsvPath)) {
    console.log(`Loading sales from CSV: ${salesCsvPath}`);
    sales = await loadSalesFromCSV(salesCsvPath);
  } else {
    console.log("CSV not found; generating dummy sales...");
    // Fetch product list to reference
    const existingProducts = await Product.find({}).lean();
    sales = generateDummySales(
      existingProducts.length ? existingProducts : products
    );
  }

  // Insert sales (upsert on orderId)
  let salesInserted = 0;
  for (const s of sales) {
    if (!s.orderId || !s.date || !s.product) continue;
    try {
      await Sale.updateOne(
        { orderId: s.orderId },
        { $set: s },
        { upsert: true }
      );
      salesInserted++;
    } catch (e) {
      console.warn(`Sale upsert failed for ${s.orderId}:`, e.message);
    }
  }
  console.log(`Sales upserted: ${salesInserted}`);

  await mongoose.connection.close();
  console.log("Seeding complete. MongoDB connection closed.");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  mongoose.connection.close().then(() => process.exit(1));
});
