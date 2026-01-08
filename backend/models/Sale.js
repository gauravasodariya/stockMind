import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    date: { 
      type: Date, 
      required: true 
    },
    orderId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    product: { 
      type: String, 
      required: true 
    },
    sku: { 
      type: String 
    },
    region: { 
      type: String 
    },
    quantity: { 
      type: Number 
    },
    amount: { 
      type: Number 
    },
    status: { 
      type: String 
    },
  },
  { timestamps: true }
);

const Sale =
  mongoose.models.Sale || mongoose.model("Sale", SaleSchema, "sales");

export default Sale;
